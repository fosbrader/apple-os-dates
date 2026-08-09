import type { paths } from "../src/lib/public-api/client.generated";

type Assert<T extends true> = T;

type SearchResponse =
  paths["/api/v1/search/"]["get"]["responses"][200]["content"]["application/json"];
type SearchResult = SearchResponse["data"][number];
type EventsQuery = NonNullable<
  paths["/api/v1/events/"]["get"]["parameters"]["query"]
>;

/**
 * Type-level client fixture. `tsc --noEmit` compiles it in CI after verifying
 * that generated types exactly match the in-repo OpenAPI document.
 */
export type PublicApiClientContractFixture = [
  Assert<SearchResult["record"]["api_path"] extends string ? true : false>,
  Assert<SearchResult["record"]["dataset"] extends string ? true : false>,
  Assert<"text" extends keyof SearchResult ? false : true>,
  Assert<EventsQuery extends { is_revision?: boolean } ? true : false>,
];
