type TranslatedMessages = { [key: string]: string }

export const errorMessageTranslations: TranslatedMessages = {
  //SIGNUP
  'PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation:Unique constraint failed on the fields: (`email`)':
    'Diese E-Mail-Adresse ist bereits registriert.',
}
