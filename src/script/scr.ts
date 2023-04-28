import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeMarmiton(url) {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const title = $('.SHRD__sc-10plygc-0.itJBWW').text();
  const ingredients = $('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-3.MuiGrid-grid-sm-3');
  const stepsContents = $('.RCP__sc-1wtzf9a-3.bFBrMO');
  const ustensiles = $('.RCP__sc-1641h7i-3.iLcXC');

  const ingredientsList = [];
  const stepsList = [];
  const ustensilesList = [];

  ingredients.each((_, element) => {
    ingredientsList.push($(element).text());
  });

  stepsContents.each((index, element) => {
    stepsList.push(`Étape ${index + 1}: ${$(element).text()}`);
  });

  ustensiles.each((_, element) => {
    ustensilesList.push($(element).text());
  });

  return {
    title: title,
    ingredients: ingredientsList,
    ustensiles: ustensilesList,
    steps: stepsList,
  };
}
