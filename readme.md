# 🧙‍♂️📜 Enchanted Scroll

Enchanted Scroll is a powerful PDF generator that transforms your HTML templates into mesmerizing and enchanting ~scrolls~ PDF files. With Enchanted Scroll, you can effortlessly convert your beautifully designed HTML templates into PDF format, ready to be shared, printed, or displayed in all their magical glory.

*Note:* This is not intended for use on the client. This project is specifically built and optimized for NodeJS server applications. 

## ✨ Features

Enchanted Scroll offers a range of powerful features to help you convert HTML content into professional PDF documents:

- **HTML to PDF Conversion**: Easily convert local HTML files or HTML strings into PDF documents.
- **URL to PDF Conversion**: Transform any webpage or remote HTML document into a high-quality PDF document.
- **Flexible Output Options**: Choose your preferred output format for the generated PDF - whether it's a buffer, a blob, or a saved file.
- **Customizable PDF Settings**: Fine-tune the details of your PDF files using Puppeteer's versatile options to meet your specific requirements.
- **Express Your Style**: Design your documents exactly as you envision using HTML and CSS, and Enchanted Scroll will faithfully convert them into stunning PDFs.

Experience the magic of Enchanted Scroll as it effortlessly brings your HTML content to life in the form of beautiful, professional PDF documents.

## ✨ Usage
 
To use Enchanted Scroll in your project, follow these steps:

### Installing Enchanted Scroll:
Install enchanted scroll from NPM.

`npm i enchanted-scroll`

### Basic Use Case:
The following example generates a PDF Buffer from an HTML string. 

```javascript
import EnchantedScroll from 'enchanted-scroll';

const enchantedScroll = new EnchantedScroll();
const pdf = await enchantedScroll.generate({ 
  htmlString: '<h1>Hello World</h1>'
});
```

### PDF File Configuration

Enchanted Scroll uses Puppeteer's PDF options for file layout customization. You can pass your desired options when generating the PDF. Refer to the [Puppeteer documentation](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-class-pagepdfoptions) for more details on available PDF options.

Here's an example of Enchanted Scroll's default PDF options:

```json
{
  "format": "A4",
  "margin": {
    "top": "1cm",
    "bottom": "1cm",
    "left": "1cm",
    "right": "1cm"
  },
  "printBackground": true,
  "displayHeaderFooter": true
}
```

## 📜 Contribution

Contributions to Enchanted Scroll are welcome! If you find any issues or have suggestions for improvements, please open an issue on the GitHub repository or submit a pull request.