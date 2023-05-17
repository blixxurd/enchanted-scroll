# 🪄📜 Enchanted Scroll

Enchanted Scroll is a powerful PDF generator that transforms your HTML templates into mesmerizing and enchanting ~scrolls~ PDF files. With Enchanted Scroll, you can effortlessly convert your beautifully designed HTML templates into PDF format, ready to be shared, printed, or displayed in all their magical glory.

## Features

- **HTML to PDF Conversion**: Enchanted Scroll enables you to convert HTML templates into PDF documents.
- **Buffer or File Output**: You can choose to generate the PDF as a buffer or save it as a file.
- **Flexible Generation**: Generate PDFs from HTML strings or input HTML files using Puppeteer.
- **Customizable PDF Options**: Use Puppeteer's PDF options to customize the PDF generation process.

## Usage

To use Enchanted Scroll in your project, follow these steps:

1. Import the module and the required services into your JavaScript file:

```javascript
import EnchantedScroll from 'enchanted-scroll';
```

2. Create a new instance of Enchanted Scroll:

```javascript
const enchantedScroll = new EnchantedScroll({
    // Optional, a port to run the listener service on
    httpPort: 3000,
    // Optional PDF formatting options
    pdfOptions: {
        format: 'A4',
        margin: {
            top: '1cm',
            bottom: '1cm',
            left: '1cm',
            right: '1cm'
        },
        printBackground: false,
        omitBackground: true,
    },
    // Optional output folder. When not explicitly set, generator returns a buffer
    outputDirectory: '/path/to/output/folder'
});
```

3. Generate the PDF:

```javascript
// PDF from From a string
const pdf = await enchantedScroll.generate({ htmlString });

// PDF From a file
const pdf = await enchantedScroll.generate({
    htmlFilePath: '/path/to/html/file',
    // Optional filename parameter adds a namespace to the generated filename
    filename: 'some-optional-namespace'
});
```

**Note:** Ensure that Puppeteer is properly installed and configured in your project, as Enchanted Scroll uses Puppeteer for PDF generation. In most cases this should happen just fine in the `npm i` - but mileage may vary across platforms and projects. 

## PDF Configuration

Enchanted Scroll uses Puppeteer's PDF options for customization. You can pass the desired options when generating the PDF. Here's an example of the default PDF options:

```javascript
const options = {
  format: 'A4',
  margin: {
    top: '1cm',
    bottom: '1cm',
    left: '1cm',
    right: '1cm'
  },
  printBackground: true,
  displayHeaderFooter: true,
};
```

Refer to the [Puppeteer documentation](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-class-pagepdfoptions) for more details on available PDF options.

## Contribution

Contributions to Enchanted Scroll are welcome! If you find any issues or have suggestions for improvements, please open an issue on the GitHub repository or submit a pull request.