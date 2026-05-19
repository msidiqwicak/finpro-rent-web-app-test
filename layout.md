<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Evergreen Escapes</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&amp;family=Manrope:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-container": "#252e23",
                        "on-primary-fixed": "#0b2013",
                        "surface-variant": "#e1e3e1",
                        "primary": "#061b0e",
                        "secondary": "#56642b",
                        "on-secondary": "#ffffff",
                        "on-secondary-fixed-variant": "#3e4c16",
                        "error-container": "#ffdad6",
                        "inverse-on-surface": "#f0f1ef",
                        "on-tertiary-container": "#8c9687",
                        "secondary-fixed": "#d9eaa3",
                        "surface-dim": "#d9dad8",
                        "outline-variant": "#c3c8c1",
                        "on-tertiary-fixed-variant": "#40493d",
                        "primary-fixed-dim": "#b4cdb8",
                        "surface": "#f9faf8",
                        "tertiary-fixed": "#dce6d5",
                        "secondary-container": "#d6e7a1",
                        "background": "#f9faf8",
                        "on-error": "#ffffff",
                        "surface-bright": "#f9faf8",
                        "primary-fixed": "#d0e9d4",
                        "surface-container-lowest": "#ffffff",
                        "outline": "#737973",
                        "surface-container": "#edeeec",
                        "on-secondary-container": "#5a682f",
                        "on-primary": "#ffffff",
                        "on-tertiary-fixed": "#151e14",
                        "error": "#ba1a1a",
                        "on-primary-container": "#819986",
                        "inverse-primary": "#b4cdb8",
                        "tertiary": "#111910",
                        "on-tertiary": "#ffffff",
                        "primary-container": "#1b3022",
                        "surface-container-high": "#e7e8e6",
                        "surface-container-low": "#f3f4f2",
                        "on-error-container": "#93000a",
                        "surface-container-highest": "#e1e3e1",
                        "surface-tint": "#4d6453",
                        "on-surface": "#191c1b",
                        "inverse-surface": "#2e3130",
                        "on-primary-fixed-variant": "#364c3c",
                        "secondary-fixed-dim": "#bdce89",
                        "on-secondary-fixed": "#161f00",
                        "tertiary-fixed-dim": "#c0c9ba",
                        "on-surface-variant": "#434843",
                        "on-background": "#191c1b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "unit": "8px",
                        "container-max": "1280px",
                        "margin-desktop": "64px",
                        "margin-tablet": "32px",
                        "gutter": "24px",
                        "margin-mobile": "20px"
                    },
                    "fontFamily": {
                        "body-lg": ["Manrope"],
                        "caption": ["Manrope"],
                        "body-md": ["Manrope"],
                        "headline-sm": ["Plus Jakarta Sans"],
                        "display-lg-mobile": ["Plus Jakarta Sans"],
                        "headline-md": ["Plus Jakarta Sans"],
                        "display-lg": ["Plus Jakarta Sans"],
                        "label-md": ["Manrope"]
                    },
                    "fontSize": {
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "caption": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "headline-sm": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "display-lg-mobile": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "headline-md": ["32px", {"lineHeight": "40px", "fontWeight": "600"}],
                        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar -->
<nav class="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop h-20 max-w-container-max mx-auto">
<a class="text-headline-sm font-headline-sm text-primary dark:text-primary-fixed tracking-tight" href="#">
                Evergreen Escapes
            </a>
<div class="hidden md:flex items-center space-x-8">
<a class="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 font-body-md text-body-md font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Find Stays</a>
<a class="text-on-surface-variant dark:text-on-tertiary-container font-body-md text-body-md font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Sustainability</a>
<a class="text-on-surface-variant dark:text-on-tertiary-container font-body-md text-body-md font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">About Us</a>
</div>
<div class="flex items-center space-x-4">
<button class="hidden md:block bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-md text-label-md hover:shadow-md transition-all">
                    Host Your Eco-Stay
                </button>
<button aria-label="Profile" class="p-2 text-primary hover:bg-surface-container rounded-full transition-colors">
<span class="material-symbols-outlined">person</span>
</button>
</div>
</div>
</nav>
<main>
<!-- Hero Section -->
<section class="relative h-[819px] min-h-[600px] flex items-center justify-center px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
<div class="absolute inset-0 z-0">
<img alt="Modern eco-cabin in a lush forest" class="w-full h-full object-cover" data-alt="A high-quality, wide-angle photograph of a sleek, modern eco-cabin nestled within a dense, verdant forest. The architecture features large glass windows reflecting the surrounding tall pine trees. The lighting is soft and natural, suggesting early morning with a gentle mist rolling through the woods. The overall mood is incredibly tranquil and inviting, perfectly embodying the 'Modern Organic' style with deep forest greens and soft sage tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOeJ5XjA_Oy3NLi0BSd9Adn3U92agqn4SJRiwW8W-Vq5P51ENL7yFYtwHMJEPbdwRG2aClRyxN4PDSY7j74p65beGBYtW_QQpjoej0y6yJAJxfT_tkoHhKFMTaxwG9nKcyYlAZFNbM18I0S0RqZ5qiQKPNTk3Xo7IPvut6uv2BZpFIHa5GVKtMzPPf3I7mBn85leMrvkE5FXTq5jHjkDTjtCIdEN9TFIDZ2rxNq-iakRfOhtt5NLicvfCaEN13hyUKrGhXHxYG6Ohf"/>
<div class="absolute inset-0 bg-primary/30"></div>
</div>
<div class="relative z-10 max-w-container-max mx-auto w-full text-center flex flex-col items-center">
<h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6 drop-shadow-md">
                    Escape into the Heart of Nature
                </h1>
<p class="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mb-12 drop-shadow-sm">
                    Discover sustainable stays that connect you with the outdoors.
                </p>
<!-- Search Component -->
<div class="bg-surface p-4 rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center border border-outline-variant/30">
<div class="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-outline-variant/30">
<label class="block font-caption text-caption text-on-surface-variant mb-1">Location</label>
<input class="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50" placeholder="Where to?" type="text"/>
</div>
<div class="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-outline-variant/30">
<label class="block font-caption text-caption text-on-surface-variant mb-1">Dates</label>
<input class="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50" placeholder="Add dates" type="text"/>
</div>
<div class="flex-1 w-full px-4 py-2">
<label class="block font-caption text-caption text-on-surface-variant mb-1">Guests</label>
<input class="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50" placeholder="Add guests" type="text"/>
</div>
<button class="w-full md:w-auto bg-primary text-on-primary p-4 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center min-w-[56px]">
<span class="material-symbols-outlined">search</span>
</button>
</div>
</div>
</section>
<!-- Category Selection -->
<section class="py-12 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max mx-auto border-b border-surface-container-high">
<div class="flex flex-wrap justify-center gap-8 md:gap-16">
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
<span class="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-primary-container">forest</span>
</div>
<span class="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Forest</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
<span class="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-primary-container">landscape</span>
</div>
<span class="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Mountain</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
<span class="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-primary-container">water_drop</span>
</div>
<span class="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Waterfall</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
<span class="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-primary-container">grass</span>
</div>
<span class="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Meadow</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
<span class="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-primary-container">agriculture</span>
</div>
<span class="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Eco-Farm</span>
</button>
</div>
</section>
<!-- Featured Collection -->
<section class="py-20 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max mx-auto">
<div class="flex justify-between items-end mb-12">
<h2 class="font-headline-md text-headline-md text-on-surface">Featured Eco-Retreats</h2>
<a class="font-label-md text-label-md text-primary hover:underline flex items-center gap-1" href="#">
                    View all <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
<!-- Card 1 -->
<article class="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow duration-300 group cursor-pointer">
<div class="relative h-64 overflow-hidden">
<img alt="The Mossy Cabin exterior" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A beautiful, cozy A-frame cabin surrounded by dense mossy trees in the Pacific Northwest. The wooden exterior blends perfectly with the natural environment. Soft, diffused lighting highlights the rich greens of the surrounding forest and the warm wood tones of the cabin, perfectly capturing the Modern Organic aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7X-AHRXBj8LlLOINQdMkO_fWprGQpIdk0iG576VFBxyG-ZO0TLi3iDqW1bM5Mi2YX2mkuKSkjqstcJpgWGpP6rcqkeit8JhYIXKhwAkiiIinLNzzPNdoyJtn2Wp7npFt3bModyBgdTietKsvk3eYauLT56aaxwjczvVXNxUaFKjsA0wRNljhG3IDeWKEbvP0nvyVZks8bcVMNSuAttPClgbfXE2Mani_sxCH85e1LTrZGNeobSJdN8PXXSSsX1jT-shl3vb6Oa9Cf"/>
<div class="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-secondary">eco</span>
<span class="font-caption text-caption text-on-surface">Solar Powered</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline-sm text-[20px] text-on-surface">The Mossy Cabin</h3>
<div class="flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="font-label-md text-label-md">4.9</span>
</div>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">Olympic Peninsula, WA</p>
<div class="flex justify-between items-center mt-auto">
<p class="font-headline-sm text-[18px] text-primary-container font-bold">$185 <span class="font-body-md text-sm font-normal text-on-surface-variant">/ night</span></p>
</div>
</div>
</article>
<!-- Card 2 -->
<article class="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow duration-300 group cursor-pointer">
<div class="relative h-64 overflow-hidden">
<img alt="Pine Grove Villa" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A modern, minimalist villa constructed from sustainable timber, nestled in a sparse pine grove. The sun is setting, casting a warm, golden glow on the structure. The clean lines of the architecture contrast beautifully with the organic shapes of the pine trees, creating a serene and premium atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS2KCZD__8jqHig8RjtnJTTajuK5_HmJk0uSylwyAPW9P2fYaJrkG7ippXIsClQiTR5K8u_Q8oVkXWEozR4cvMal67Axlbbsr5PRGnyk2mjQ560remfT5xkH-SQQDpgVlYDVR1-7RBvusnBEUKcFvkmyituNjX2Oj23dWClUUl6aREo2C7_ksBGPGpRsyKoMbaoN-y2k-kaGSQmnpjodQZ8aneZNm0udg5VrdxYtgHxRjWDR93Aba6gyunXneXtEcdnvt-dA1JYppn"/>
<div class="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-secondary">eco</span>
<span class="font-caption text-caption text-on-surface">Zero Waste</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline-sm text-[20px] text-on-surface">Pine Grove Villa</h3>
<div class="flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="font-label-md text-label-md">4.8</span>
</div>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">Catskill Mountains, NY</p>
<div class="flex justify-between items-center mt-auto">
<p class="font-headline-sm text-[18px] text-primary-container font-bold">$240 <span class="font-body-md text-sm font-normal text-on-surface-variant">/ night</span></p>
</div>
</div>
</article>
<!-- Card 3 -->
<article class="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow duration-300 group cursor-pointer">
<div class="relative h-64 overflow-hidden">
<img alt="Waterfall Sanctuary" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A tranquil wooden retreat built carefully near a gently flowing forest waterfall. The scene is lush and green, with ferns and damp rocks surrounding the structure. The lighting is soft and shaded, emphasizing the deep, calming sage and forest green colors of the environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh713pbJsFx4YwJbMsaVD1dcEIvoFr0FIegy5JKeRIxTkk0iG6NNaf-t9nN0Cer0vgequYcvW6t15g_DzJCxGK8MzQpWdfMkjpF38Xf6mNl7gCSwyio7txZvobnRcoYwPcn8XdQIyitZKX5T0MoClTezSAszDKAw9TRl_6rZvhTIuF6LUcFbll76L07PFIpRbaJvIIYtFi-LVC96TlAnE3WPnnt6DnUcXpwscn6Q3MmipHrKCRn5gvX3xczdDf27aBEXz1T1VsnG7x"/>
<div class="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-secondary">eco</span>
<span class="font-caption text-caption text-on-surface">Water Positive</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline-sm text-[20px] text-on-surface">Waterfall Sanctuary</h3>
<div class="flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="font-label-md text-label-md">5.0</span>
</div>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">Blue Ridge Parkway, NC</p>
<div class="flex justify-between items-center mt-auto">
<p class="font-headline-sm text-[18px] text-primary-container font-bold">$310 <span class="font-body-md text-sm font-normal text-on-surface-variant">/ night</span></p>
</div>
</div>
</article>
</div>
</section>
<!-- Sustainability Highlight -->
<section class="py-20 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-surface-container-low">
<div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<div class="rounded-2xl overflow-hidden shadow-sm h-[400px]">
<img alt="Traveler planting a tree" class="w-full h-full object-cover" data-alt="A peaceful, high-quality image of a person's hands gently planting a young tree sapling into rich, dark soil. The background is a soft, out-of-focus forest, emphasizing the action. The lighting is warm and natural, conveying a sense of hope and environmental stewardship in line with the brand's eco-conscious mission." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8K0s4JuT6VXZNEQViB7pwH4bMGuZHeYEXf4DmiIfUdqqCDUJnxRr2EAfh073otdWSprnQEQ-pzyqcvcmcw6vwuhHh2RSIafwKzg9InHHN12COl70s1M6Ec7g67VXlxK3eJ_OojVD8Hyb8II8SsUUc5Vx6YJcDHaFPxTokTydqI811tyDEJX8s7ikuz78neGGMICvLM4H3TgvZ9c9gcGjEWUNR_miI5yMkVBRpP_YWoccVp4j1UjtA4eWUGDD4aQw6qRD6xnwOrDvA"/>
</div>
<div class="space-y-6">
<div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-on-secondary-container">park</span>
</div>
<h2 class="font-headline-md text-headline-md text-on-surface">Traveling with a Conscience.</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant">
                        For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
                    </p>
<button class="mt-4 border-2 border-secondary text-primary-container px-8 py-3 rounded-full font-label-md text-label-md hover:bg-secondary/10 transition-colors">
                        Learn More
                    </button>
</div>
</div>
</section>
<!-- Newsletter Sign-up -->
<section class="py-24 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-primary-container relative overflow-hidden">
<!-- Decorative blur background element -->
<div class="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
<div class="max-w-3xl mx-auto text-center relative z-10">
<h2 class="font-headline-md text-headline-md text-on-primary mb-6">Join the Evergreen Community</h2>
<p class="font-body-lg text-body-lg text-on-primary/80 mb-10">
                    Sign up for eco-travel tips, exclusive retreats, and early access to our newest sustainable properties.
                </p>
<form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
<input class="flex-1 bg-surface/10 border border-surface/20 text-on-primary placeholder-on-primary/50 px-6 py-4 rounded-lg focus:ring-2 focus:ring-primary-fixed focus:border-transparent outline-none font-body-md text-body-md" placeholder="Your email address" type="email"/>
<button class="bg-primary-fixed text-on-primary-fixed px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary-fixed/90 transition-colors whitespace-nowrap" type="submit">
                        Subscribe
                    </button>
</form>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface-container-low dark:bg-surface-container-highest py-12">
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max mx-auto">
<div class="space-y-4">
<span class="text-headline-sm font-headline-sm text-primary dark:text-primary-fixed">Evergreen Escapes</span>
<p class="font-body-md text-body-md font-caption text-caption text-on-surface-variant dark:text-on-tertiary-container">
                    © 2024 Evergreen Escapes. All rights reserved.
                </p>
</div>
<div class="col-span-1 md:col-span-2 flex flex-wrap gap-x-8 gap-y-4 md:justify-end items-center">
<a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption" href="#">Legal</a>
<a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption" href="#">Company</a>
<a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption" href="#">Privacy Policy</a>
<a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption" href="#">Terms of Service</a>
<a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption" href="#">Contact</a>
</div>
</div>
</footer>
</body></html>