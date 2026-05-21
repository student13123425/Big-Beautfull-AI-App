export class AiModel {
  path: string;
  name: string;
  number_of_parameters: string;
  max_content_length:number
  is_image_support: boolean;
  estimated_vram_usage: number;
  constructor(
    path: string,
    name: string,
    number_of_parameters: string,
    max_content_length:number,
    estimated_vram_usage: number, 
    is_image_support: boolean=false,
  ) {
    this.path = path;
    this.name = name;
    this.number_of_parameters = number_of_parameters;
    this.is_image_support = is_image_support;
    this.estimated_vram_usage = estimated_vram_usage;
    this.max_content_length=max_content_length
  }
}
export class AiServerError {
  title: string | null;
  content: string | null;
  active: boolean;

  constructor(
    title: string | null = null,  
    content: string | null = null,
    active: boolean = true
  ) {
    this.title = title;
    this.content = content;
    this.active = active;
  }
}

export interface AiTextCorectionData {
  detailed_markdown: string;
  score:number
}
