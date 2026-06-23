interface CategoryResult {
    id: string;
    name: string;
    tenant_id: string;
    _count?: {
        property: number;
    };
}
export declare const getCategoriesByTenant: (tenantId: string) => Promise<CategoryResult[]>;
export declare const createCategory: (tenantId: string, name: string) => Promise<CategoryResult>;
export declare const updateCategory: (tenantId: string, categoryId: string, newName: string) => Promise<CategoryResult>;
export declare const deleteCategory: (tenantId: string, categoryId: string) => Promise<void>;
export {};
//# sourceMappingURL=property-category.service.d.ts.map