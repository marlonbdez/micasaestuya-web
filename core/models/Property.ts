import { IProperty } from '~/core/types'

export default class Property implements IProperty {
  id?: string
  description: string
  price: number

  constructor(data: IProperty) {
    this.id = data.id
    this.description = data.description
    this.price = data.price
  }
}
