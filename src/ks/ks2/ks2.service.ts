import { Injectable } from "@nestjs/common";

@Injectable()
export class KS2Service {
  constructor() {}

  async uploadKS2File(body) {
    console.log(body)
    return {
      success: true,
      data: 'file'
    }
  }
}