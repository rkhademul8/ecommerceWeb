import apiClient from "@/utils/axios";

export const productSearch = async (params?: any) => {
  return apiClient.get("/products-remote/search-by-keyword", { params });
};

export const getDescriptions = async (params?: any) => {
  return apiClient.get("/products-remote/get-product-description", { params });
};

//  'http://localhost:3000/products-remote/get-product-description?productId=956006286299&source=osee' \

export const similerProductSearch = async (params?: any) => {
  return apiClient.get("/products-remote/search-by-category", { params });
};

export const getProductDetails = async (params?: any) => {
  return apiClient.get("/products-remote/get-product-details", { params });
};

export const uploadProductSearchImage = async (formData: any) => {
  return apiClient.post(
    "/products-remote/upload-product-search-image",
    formData
  );
};

export const productSearchByImage = async (params?: any) => {
  return apiClient.get("/products-remote/search-by-image", { params });
};
