// import axios from 'axios';
// import cheerio, { Cheerio, Element } from 'cheerio';

// interface Recipe {
//   title: string;
//   ingredients: string[];
//   steps: string[];
// }

// export async function scrapeCuisine(url: string): Promise<Recipe> {
//   const { data: html } = await axios.get(url);
//   const $ = cheerio.load(html);

//   const title = $('.recipe-title').text();
//   const ingredientsElements = $('.borderSection.ingredients ul li');
//   const stepsContents = $('li > p > span');

//   const ingredientsList: string[] = [];
//   const stepsList: string[] = [];

//   ingredientsElements.each((_index: number, element: Element) => {
//     const ingredientSpans = $(element).find('span');
//     let ingredient = $(ingredientSpans[0]).text().trim();
//     if (ingredientSpans.length > 1) {
//       ingredient += ` ${$(ingredientSpans[1]).text().trim()}`;
//     }
//     ingredientsList.push(ingredient);
//   });

//   stepsContents.each((index: number, element: Element) => {
//     stepsList.push(`Étape ${index + 1}: ${$(element).text().trim()}`);
//   });

//   return {
//     title: title,
//     ingredients: ingredientsList,
//     steps: stepsList,
//   };
// }

// const testUrl = 'https://www.cuisineaz.com/recettes/barbecue-pas-cher-116147.aspx';

// scrapeCuisine(testUrl)
//   .then(recipe => console.log(recipe))
//   .catch(err => console.error(err));

