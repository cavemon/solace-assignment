Discussion Notes
=================

Thanks for taking the time to review my work. This was a fun exercise and I appreciate it's relevance to Solace's product.

I've outlined Bug Fixes, Enhancements, and Roadmap items below.

## Bug Fixes
There were a few glaring bug fixes that I tackled first.

### [Invalid Table Markup](https://github.com/cavemon/solace-assignment/pull/1)
The `<th>` were direct descendants of the `<thead>`, which was lacking a supporting table row `<tr>`

### [Loop Children missing "key" prop](https://github.com/cavemon/solace-assignment/pull/2)
Adding `key` prop to items in iterator gives elements stable identity in React.  Simply outputting the index is not sufficient during the output of the specialties as this will likely create duplicate keys, thus leveraging the index of the parent row is required so that the output ends up like: `advocate-row-1-specialties-0`.

### [Removal of direct DOM manipulation](https://github.com/cavemon/solace-assignment/pull/3/files#diff-73d7a23e5015801b9bcc9db601d6ec9594d3eb34e5bb23154e0ae4b0c30f1a3bL22)
The search input was originally being manipulated via `document.getElementById("search-term").innerHTML = searchTerm`.  This is an anti-pattern in React as it can cause conflicts with the virtual DOM.  The issue was resolved during the enhancements and overhaul of the search feature.

## Feature Enhancements

### [Search](https://github.com/cavemon/solace-assignment/pull/3)
The main feature enhancement that was developed was in terms of the search feature.  Originally, the code was simply filtering the results that were queried initially.  Based on requirements and expectations that this database could contain thousands of results, it would not be performant nor plausible to run this filter based only on what is initially returned.  Instead, I've introduced an API endpoint to query the results from the database by search term.   

### [Postgres Full-Text Search](https://github.com/cavemon/solace-assignment/pull/3/files#diff-4bccf0a85960664570150bcf86a66e64e825b88f02fe19c2e323e96f65e2d55fR24)
Taking the general search enhancements a step further, I've created an index of advocate data to search against when making queries.  Doing so required using Drizzle's magic `sql` operator as there is not an API method to do this built in to Drizzle.

## Roadmap
### Pagination
Expecting a large amount of results in the database, I think it would be wise and performant to introduce pagination.  This will reduce result size when querying and improve performance.

### Sorting
Adding ability to sort by First Name, Last Name, and Years of Experience would enhance user experience.

### Filtering
In addition to a text field for searching, it would be a nice UX to enable filtering by Degree, City, and Years of Experience.