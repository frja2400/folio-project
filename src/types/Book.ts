
// Interface för bokdata från Google Books API
export interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    publisher?: string
    publishedDate?: string
    pageCount?: number
    language?: string
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    industryIdentifiers?: {
      type: string
      identifier: string
    }[]
    averageRating?: number
    ratingsCount?: number
  }
}