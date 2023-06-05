// Require node module from root
const EnchantedScroll = require('../dist/main').default;
const pdfGenerator = new EnchantedScroll({
    outputDirectory: './.tmp/tests',
    logging: false
});

// Tests that test the base functionality of the EnchantedScroll class
describe('EnchantedScroll Base Tests', () => {

    // 1. Test that the pdfGenerator is an instance of EnchantedScroll
    test('pdfGenerator is an instance of EnchantedScroll', () => {
        expect(pdfGenerator).toBeInstanceOf(EnchantedScroll);
    });
});

// Tests that test the generating of a PDF from a HTML string
describe('Tests from HTML String Input', () => {

    // Tests that test the generating of a PDF from a HTML string
    const htmlString = '<h1>Hello World</h1>';

    // 1. Test that the HTML string is converted to a PDF file, by checking that the output is a JSON Object that 
    // matches the key parts of our 'IFile' type
    test('HTML String can be converted to a PDF file', async () => {
        pdfGenerator.outputType = 'file';
        const fileName = 'test-html-string';
        const pdf = await pdfGenerator.generate({ htmlString, fileName });
        // Checking the 'IFile' type
        expect(pdf).toBeInstanceOf(Object);
        expect(pdf).toHaveProperty('filename');
        expect(pdf.filename_original).toBe(fileName);
    });

    // 2. Test that the HTML string is converted to a PDF buffer by checking that the output is a Buffer type
    test('HTML String can be converted to a PDF Buffer', async () => {
        pdfGenerator.outputType = 'buffer';
        const pdf = await pdfGenerator.generate({ htmlString });
        expect(pdf).toBeInstanceOf(Buffer);
    });

    // 3. Test that the HTML string is converted to a PDF Blob by checking that the output is a Blob type
    test('HTML String can be converted to a PDF Blob', async () => {
        pdfGenerator.outputType = 'blob';
        const pdf = await pdfGenerator.generate({ htmlString });
        expect(pdf).toBeInstanceOf(Blob);
    });

});

// Tests that test the generating of a PDF from a HTML file
describe('Tests from HTML File Input', () => {
    const htmlFilePath = './__test/test.html';

    test('HTML File can be converted to a PDF file', async () => {
        pdfGenerator.outputType = 'file';
        const fileName = 'test-html-file';
        const pdf = await pdfGenerator.generate({ htmlFilePath, fileName });
        // Checking the 'IFile' type
        expect(pdf).toBeInstanceOf(Object);
        expect(pdf).toHaveProperty('filename');
        expect(pdf.filename_original).toBe(fileName);
    });

    // 2. Test that the HTML string is converted to a PDF buffer by checking that the output is a Buffer type
    test('HTML File can be converted to a PDF Buffer', async () => {
        pdfGenerator.outputType = 'buffer';
        const pdf = await pdfGenerator.generate({ htmlFilePath });
        expect(pdf).toBeInstanceOf(Buffer);
    });

    // 3. Test that the HTML string is converted to a PDF Blob by checking that the output is a Blob type
    test('HTML File can be converted to a PDF Blob', async () => {
        pdfGenerator.outputType = 'blob';
        const pdf = await pdfGenerator.generate({ htmlFilePath });
        expect(pdf).toBeInstanceOf(Blob);
    });


});