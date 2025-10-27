import {
  DBButton,
  DBCard,
  DBDrawer,
  DBInput,
  DBTooltip,
} from "@db-ux/react-core-components";
import React, { type ReactElement, useEffect, useState } from "react";
import {
  type AnyOrama,
  create,
  load,
  type RawData,
  type Results,
  search,
} from "@orama/orama";
import useDebounce from "@root/template/hooks/debounce";
import { getMarkedContent } from "@template/utils/app.utils.ts";

type PageSchema = {
  path: string;
  title: string;
  h1: string;
  content: string;
};

/**
 * Search button which triggers a drawer with a search input.
 * The search input will search through the pages content and display the results.
 * The results are a sort summary of the content with the search term highlighted.
 */
export function Search(): ReactElement {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [pagesDb, setPagesDb] = useState<AnyOrama>();
  const [searchResults, setSearchResults] = useState<Results<PageSchema>>();
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const run = async () => {
      const db = create({ schema: { _: "string" } });

      const dbResponse = await fetch(
          `${import.meta.env.BASE_URL}assets/oramaDB_pages.json`
      );
      if (dbResponse.ok) {
        const dbData = (await dbResponse.json()) as RawData;

        load(db, dbData);

        setPagesDb(db);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (pagesDb && debouncedQuery) {
      const results: Results<PageSchema> | Promise<Results<PageSchema>> =
        search(pagesDb, {
          term: debouncedQuery,
        });
      setSearchResults(results as Results<PageSchema>);
    }
  }, [debouncedQuery, pagesDb]);

  return (
    <div className="dba-search">
      <DBButton
        icon="magnifying_glass"
        noText
        variant="ghost"
        onClick={() => setSearchOpen(true)}
      >
        Open Search
        <DBTooltip placement="left">Open Search</DBTooltip>
      </DBButton>
      <DBDrawer open={searchOpen} onClose={() => setSearchOpen(false)}>
        <div className="dba-search-result-container">
          <DBInput
            label="Search"
            placeholder="Search"
            icon="magnifying_glass"
            variant="floating"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
          />
          {(searchResults?.hits?.length || 0) > 0 ? (
            searchResults?.hits.map((hit) => {
              const content = hit.document.content.replace(hit.document.h1, "");
              const { start, termIndex, end } = getMarkedContent(
                content,
                query,
              );
              return (
                <a
                  key={hit.document.path}
                  href={`${import.meta.env.BASE_URL}${hit.document.path.replace("/", "")}`}
                >
                  <DBCard>
                    <span className="bold">{hit.document.h1}</span>
                    <small>
                      {content.substring(start, termIndex)}
                      <mark>
                        {content.substring(termIndex, termIndex + query.length)}
                      </mark>
                      {content.substring(termIndex + query.length, end)}
                    </small>
                  </DBCard>
                </a>
              );
            })
          ) : (
            <p className="no-results">No results found</p>
          )}
        </div>
      </DBDrawer>
    </div>
  );
}
