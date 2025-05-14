export type UploadType = 'photo' | 'invoice_doc' | 'other';

export interface ICargoUploadResponse {
  result: {
    name: string;
    file_name: string;
    disk: string;
    conversions_disk: string;
    collection_name: string;
    mime_type: string;
    size: number;
    custom_properties: any[];
    generated_conversions: any[];
    responsive_images: any[];
    manipulations: any[];
    model_id: number;
    model_type: string;
    uuid: string;
    order_column: number;
    updated_at: string;
    created_at: string;
    id: number;
    original_url: string;
    preview_url: string;
  };
}
