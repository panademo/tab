import { getCountry } from 'js/utils/client-location'

/**
 * Get the market code for the Bing search request. This parameter
 * isn't required but is highly encouraged. Bing has a set list of
 * supported market codes, but if "you specify a market that is not
 * listed in Market Codes, Bing uses a best fit market code based on
 * an internal mapping".
 * https://docs.microsoft.com/en-us/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#mkt
 * @return {Promise<String|null>} The 5-character market code of structure
 *   <ISO language code>-<ISO country code>, if both language and country
 *   are known; else, null.
 */
const getBingMarketCode = async () => {
  // This may be a 2-character or 5-character code.
  // https://stackoverflow.com/a/25603630
  const language = navigator.languages
    ? navigator.languages[0]
    : navigator.language || navigator.userLanguage
  // We do not know the language.
  if (!language) {
    return null
    // The language preference includes a country code.
  } else if (language.length === 5) {
    return language
    // The language preference does not include a country code.
    // Get the country code ourselves.
  } else {
    try {
      const countryCode = await getCountry()
      if (!countryCode) {
        // We don't know the country.
        return null
      } else {
        return `${language}-${countryCode}`
      }
    } catch (e) {
      return null
    }
  }
}

export default getBingMarketCode
