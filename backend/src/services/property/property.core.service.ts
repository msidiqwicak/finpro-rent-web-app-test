import { prisma } from "../../utils/prisma.js";
import type { CreatePropertyInput } from "./property.helpers.js";
import { getTenantId, assertPropertyOwner, parseImages } from "./property.helpers.js";

export const getMyProperties = async (userId: string) => {
  const tenantId = await getTenantId(userId);
  return prisma.property.findMany({
    where: { tenant_id: tenantId, deleted_at: null },
    include: {
      room_type: { where: { deleted_at: null }, include: { price_modifier: true } },
      property_category: true,
    },
    orderBy: { created_at: "desc" },
  });
};

export const createProperty = async (userId: string, data: CreatePropertyInput, files?: Express.Multer.File[]) => {
  const tenantId = await getTenantId(userId);
  const image_urls = files?.map(f => f.path) || [];
  
  return prisma.property.create({
    data: { 
      name: data.name, 
      description: data.description ?? null, 
      address: data.address, 
      city: data.city, 
      province: data.province, 
      category_id: data.category_id === "" || !data.category_id ? null : data.category_id,
      latitude: data.latitude ? parseFloat(String(data.latitude)) : null, 
      longitude: data.longitude ? parseFloat(String(data.longitude)) : null,
      tenant_id: tenantId, 
      image_urls 
    },
  });
};

export const updateProperty = async (userId: string, propertyId: string, data: any, files?: Express.Multer.File[]) => {
  const tenantId = await getTenantId(userId);
  const existingProp = await assertPropertyOwner(propertyId, tenantId);
  
  const cleanData: any = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  
  if (data.existing_images !== undefined || (files && files.length > 0)) {
    cleanData.image_urls = parseImages(data.existing_images, existingProp.image_urls, files);
  }
  delete cleanData.existing_images;

  return prisma.property.update({
    where: { id: propertyId },
    data: { ...cleanData, updated_at: new Date() },
  });
};

export const deleteProperty = async (userId: string, propertyId: string) => {
  const tenantId = await getTenantId(userId);
  await assertPropertyOwner(propertyId, tenantId);
  
  await prisma.property.update({
    where: { id: propertyId },
    data: { deleted_at: new Date() },
  });
  
  return { message: "Properti berhasil dihapus." };
};
