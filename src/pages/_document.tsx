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
        {/* Don't use <body className> since our layout expect some classes to be present always (which are in index.css) and other applied conditionally in LayoutMap.tsx. It looks like there is no easy way to merge classes using next/head. */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
