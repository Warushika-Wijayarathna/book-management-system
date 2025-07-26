export type Book = {
    _id: string
    title: string
    author: string
    isbn: string
    publishedYear: number
    category: string
    totalCopies: number
    availableCopies: number
    addedDate: Date
    imageUrl?: string
}

export type BookFormData = {
    title: string
    author: string
    isbn: string
    publishedYear: number
    category: string
    totalCopies: number
    availableCopies: number
    addedDate: Date
    imageUrl?: string
}
