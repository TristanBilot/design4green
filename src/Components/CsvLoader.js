import '../Styles/articles.scss';

import csvFile from '../INR.csv'
const Papa = require('papaparse');

let csv;

Papa.parse(csvFile, {
    download: true,
    complete: function (input) {
        console.log('LOADING...')
        csv = input.data;
        console.log(csv)
    }
});

export default csv;
