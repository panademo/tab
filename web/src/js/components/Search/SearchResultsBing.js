import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import { range } from 'lodash/util'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'
import SearchResultItem from 'js/components/Search/SearchResultItem'

const styles = theme => ({
  searchResultsParentContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  searchResultsContainer: {
    marginTop: 6,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 520,
    margin: 'auto auto 20px auto',
  },
  paginationButton: {
    minWidth: 40,
  },
})

const SearchResultsBing = props => {
  const {
    classes,
    data,
    isEmptyQuery,
    isError,
    isQueryInProgress,
    noSearchResults,
    onPageChange,
    page,
    query,
    style,
    theme,
  } = props

  // eslint-disable-next-line no-unused-vars
  const poleResults = get(data, 'rankingResponse.pole.items', [])
  const mainResults = get(data, 'rankingResponse.mainline.items', [])

  // eslint-disable-next-line no-unused-vars
  const sidebarResults = get(data, 'rankingResponse.sidebar.items', [])

  // Hiding until we make it functional.
  const SHOW_PAGINATION = false

  // Include 8 pages total, 4 lower and 4 higher when possible.
  // Page 9999 is the maximum, so stop there.
  const MIN_PAGE = 1
  const MAX_PAGE = 9999
  const paginationIndices = range(
    Math.max(MIN_PAGE, Math.min(page - 4, MAX_PAGE - 8)),
    Math.min(MAX_PAGE + 1, Math.max(page + 4, MIN_PAGE + 8))
  )

  const noResultsToDisplay = isEmptyQuery || noSearchResults || isError
  return (
    <div
      className={classes.searchResultsParentContainer}
      style={Object.assign(
        {},
        {
          // Min height prevents visibly shifting content below,
          // like the footer.
          minHeight: noResultsToDisplay ? 0 : 1000,
        },
        style
      )}
    >
      {noSearchResults ? (
        <Typography variant={'body1'} gutterBottom>
          No results found for{' '}
          <span style={{ fontWeight: 'bold' }}>{query}</span>
        </Typography>
      ) : null}
      {isError ? (
        <div data-test-id={'search-err-msg'}>
          <Typography variant={'body1'} gutterBottom>
            Unable to search at this time.
          </Typography>
          <Link
            to={`https://www.google.com/search?q=${encodeURI(query)}`}
            target="_top"
          >
            <Button color={'primary'} variant={'contained'} size={'small'}>
              Search Google
            </Button>
          </Link>
        </div>
      ) : isEmptyQuery ? (
        <Typography variant={'body1'} gutterBottom>
          Search something to start raising money for charity!
        </Typography>
      ) : null}
      {isQueryInProgress ? null : (
        <div id="search-results" className={classes.searchResultsContainer}>
          {mainResults.map(itemRankingData => {
            // Get the data for this item.
            // https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Web-Search/public/js/script.js#L168
            const typeName =
              itemRankingData.answerType[0].toLowerCase() +
              itemRankingData.answerType.slice(1)
            // https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Web-Search/public/js/script.js#L172
            const itemData = !isNil(itemRankingData.resultIndex)
              ? // One result of the specified type (e.g., one webpage link)
                get(data, `${typeName}.value[${itemRankingData.resultIndex}]`)
              : // All results of the specified type (e.g., all videos)
                get(data, `${typeName}.value`)

            // Return null if we couldn't find the result item data.
            if (!(itemRankingData.answerType && itemData)) {
              // console.error(`Couldn't find item data for:`, itemRankingData)
              return null
            }
            const key = itemData.id
              ? `${itemRankingData.answerType}-${itemData.id}`
              : itemRankingData.answerType
            return (
              <SearchResultItem
                key={key}
                type={itemRankingData.answerType}
                itemData={itemData}
              />
            )
          })}
        </div>
      )}
      <div
        data-test-id={'pagination-container'}
        className={classes.paginationContainer}
        style={{
          display: !SHOW_PAGINATION || noResultsToDisplay ? 'none' : 'block',
        }}
      >
        {page > MIN_PAGE ? (
          <Button
            data-test-id={'pagination-previous'}
            className={classes.paginationButton}
            onClick={() => {
              onPageChange(page - 1)
            }}
          >
            PREVIOUS
          </Button>
        ) : null}
        {paginationIndices.map(pageNum => (
          <Button
            key={`page-${pageNum}`}
            className={classes.paginationButton}
            data-test-id={`pagination-${pageNum}`}
            {...pageNum === page && {
              color: 'secondary',
              disabled: true,
            }}
            style={{
              ...(pageNum === page && {
                color: theme.palette.secondary.main,
              }),
            }}
            onClick={() => {
              onPageChange(pageNum)
            }}
          >
            {pageNum}
          </Button>
        ))}
        {page < MAX_PAGE ? (
          <Button
            data-test-id={'pagination-next'}
            className={classes.paginationButton}
            onClick={() => {
              onPageChange(page + 1)
            }}
          >
            NEXT
          </Button>
        ) : null}
      </div>
    </div>
  )
}

SearchResultsBing.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  isEmptyQuery: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  isQueryInProgress: PropTypes.bool.isRequired,
  noSearchResults: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
}

SearchResultsBing.defaultProps = {}

export default withStyles(styles, { withTheme: true })(SearchResultsBing)
