import Document, { Html, Main, NextScript, Head } from 'next/document'

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="de" className="h-full">
        <Head />
        {/* Remidner: With next/head we cannot add className via <html className> or <body className>. They will error with the false "next-head-count is missing" message */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
