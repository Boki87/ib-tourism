import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Tap App</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossorigin"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Secular+One&display=swap"
          rel="stylesheet"
        ></link>
        <style>font-family: 'Secular One', sans-serif;</style>
      </Head>
      <body>
        {/*<div className="bg-gradient"></div>*/}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
