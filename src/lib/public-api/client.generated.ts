export interface paths {
    "/api/v1/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get API information
         * @description Get canonical API paths and license data.
         */
        get: operations["getApiInformation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/builds/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List builds
         * @description Get verified build identities and release links. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listBuilds"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/builds/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one build
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getBuildsRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/changes/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List changes
         * @description Get approved change definitions. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listChanges"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/changes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one change
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getChangesRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/citations/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List citations
         * @description Get public source records and source locators. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listCitations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/citations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one citation
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getCitationsRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List events
         * @description Get dated channel appearances for release versions. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one event
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getEventsRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/historical-analysis/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical timing analysis
         * @description Get bounded walk-forward results from the validated historical dataset. The response includes cohort size, exclusions, uncertainty, methodology, and provenance. It does not include active or shadow forecast candidates.
         */
        get: operations["getHistoricalAnalysis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/occurrences/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List occurrences
         * @description Get changes as they occur in a build or event. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listOccurrences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/occurrences/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one occurrence
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getOccurrencesRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/openapi.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the OpenAPI document
         * @description Get this OpenAPI 3.1 document.
         */
        get: operations["getOpenApiDocument"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/provenance/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List provenance
         * @description Get public audit and correction records. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listProvenance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/provenance/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one provenance record
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getProvenanceRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/releases/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List releases
         * @description Get recorded software versions and release state. Results use stable source order: platform, version, event date when present, then record ID.
         */
        get: operations["listReleases"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/releases/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one release
         * @description Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.
         */
        get: operations["getReleasesRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search release records
         * @description Find public records that contain all search terms. Results sort by relevance score, newest record date, then title. Search result metadata deliberately excludes full editorial text; use record.api_path for the matching factual record.
         */
        get: operations["searchReleaseRecords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        builds: {
            /** @description Build number associated with this record, if known. */
            build_number: string;
            /** @description Stable URL slug for the verified build. */
            canonical_slug: string;
            /** @description Devices included in the recorded scope. */
            device_scope: string[];
            /** @description Build number formatted for display. */
            display_build_number: string;
            /** @description Major release family identifier. */
            family: string;
            /** @description Stable public identifier for this record. */
            id: string;
            /** @description True when the record meets the public indexing gate. */
            index_eligible: boolean;
            /** @description Platform identifier, such as ios or macos. */
            platform: string;
            /** @description Evidence-review state for the record. */
            provenance_status: string;
            /** @description Current release or publication status. */
            status: string;
            /**
             * Format: date-time
             * @description UTC time when this record was last updated.
             */
            updated_at: string | null;
            /** @description Software vendor that owns the release record. */
            vendor: string;
            /** @description Version number as recorded by the archive. */
            version: string;
            /** @description Public identifier of the related release record. */
            version_id: string;
        };
        buildsCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["builds"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        buildsDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["builds"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        changes: {
            /** @description Change category. */
            category: string;
            /** @description Stable public identifier for this record. */
            id: string;
            /** @description Human-readable title for the record. */
            title: string;
            /**
             * Format: date-time
             * @description UTC time when this record was last updated.
             */
            updated_at: string | null;
        };
        changesCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["changes"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        changesDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["changes"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        citations: {
            /**
             * Format: date
             * @description Date Version Record last accessed the source.
             */
            accessed_date: string | null;
            /**
             * Format: uri
             * @description Archived source URL, if available.
             */
            archive_url: string | null;
            /** @description Named author of the cited source, if available. */
            author: string | null;
            /** @description Stable public identifier for this record. */
            id: string;
            /** @description Location within the source that supports the record. */
            locator: string | null;
            /**
             * Format: date
             * @description Date the cited source was published.
             */
            publication_date: string | null;
            /** @description Publisher of the cited source. */
            publisher: string | null;
            /** @description Source classification, such as first_party. */
            source_class: string | null;
            /** @description Public identifier of the related source record. */
            source_id: string | null;
            /** @description Title of the cited source. */
            source_title: string | null;
            /**
             * Format: uri
             * @description Canonical public URL of the source.
             */
            source_url: string;
            /** @description Public identifier of the cited or changed target. */
            target_id: string;
            /** @description Type of record cited or changed. */
            target_kind: string;
        };
        citationsCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["citations"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        citationsDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["citations"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        Error: {
            /** @constant */
            api_version: "v1";
            error: {
                /** @description Stable machine-readable error code. */
                code: string;
                /** @description Short error explanation. */
                message: string;
                /** @description Invalid request parameter, if applicable. */
                parameter?: string;
            };
        };
        events: {
            /**
             * Format: date
             * @description Date the release event appeared in its channel.
             */
            appearance_date: string;
            /** @description Named audiences that could receive the event. */
            audience: string[];
            /** @description Availability state recorded for the event. */
            availability_state: string;
            /** @description Public identifier of the related verified build, if known. */
            build_id: string | null;
            /** @description Build number associated with this record, if known. */
            build_number: string | null;
            /** @description Release channel, such as developer_beta or public. */
            channel: string;
            /** @description Devices included in the recorded scope. */
            device_scope: string[];
            /** @description Major release family identifier. */
            family: string;
            /** @description Stable public identifier for this record. */
            id: string;
            /** @description True when the record meets the public indexing gate. */
            index_eligible: boolean;
            /** @description True when this event revises an earlier build appearance. */
            is_revision: boolean;
            /** @description Human-readable event label. */
            label: string;
            /** @description Languages included in the recorded scope. */
            language_scope: string[];
            /** @description Platform identifier, such as ios or macos. */
            platform: string;
            /** @description Evidence-review state for the record. */
            provenance_status: string;
            /** @description Regions included in the recorded scope. */
            region_scope: string[];
            /** @description Stable route label used by the public site. */
            route_alias: string;
            /** @description Number of linked public source records. */
            source_count: number;
            /**
             * Format: date-time
             * @description UTC time when this record was last updated.
             */
            updated_at: string | null;
            /** @description Software vendor that owns the release record. */
            vendor: string;
            /** @description Version number as recorded by the archive. */
            version: string;
            /** @description Public identifier of the related release record. */
            version_id: string;
            /** @description Version label shown when the event appeared. */
            version_label_at_appearance: string | null;
        };
        eventsCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["events"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        eventsDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["events"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        HistoricalAnalysisMetric: {
            /** @enum {string} */
            baseline: "platform-stage-median" | "seasonal-median";
            /** @enum {string} */
            group: "overall" | "family" | "stage" | "horizon";
            inclusive_coverage_50: number | null;
            inclusive_coverage_80: number | null;
            /** @description Stable identifier for the metric group. */
            key: string;
            mae_days: number | null;
            median_absolute_error_days: number | null;
            /** @description True when the row meets the fixed sample threshold. */
            reportable: boolean;
            /** @description Scored walk-forward predictions in this row. */
            score_count: number;
            signed_bias_days: number | null;
            /** @enum {string|null} */
            unavailable_reason: "minimum-score-count" | null;
        };
        HistoricalAnalysisReport: {
            breakdowns: components["schemas"]["HistoricalAnalysisMetric"][];
            cohort: {
                complete_chronology_cycle_count: number;
                eligible_interval_count: number;
                excluded_interval_count: number;
                included_release_cycle_count: number;
                release_cycle_count: number;
                scored_prediction_count: number;
                superseded_release_cycle_count: number;
                unknown_chronology_cycle_count: number;
            };
            exclusions: {
                interval_count: number;
                /** @enum {string} */
                reason: "invalid-or-unavailable-interval" | "missing-anchor" | "missing-endpoint" | "endpoint-not-after-origin" | "unknown-horizon";
            }[];
            methodology: {
                baselines: {
                    cohort_order: string[];
                    /** @constant */
                    estimator: "median";
                    /** @enum {string} */
                    id: "platform-stage-median" | "seasonal-median";
                }[];
                /** @constant */
                design: "walk-forward";
                /** @constant */
                target_unit: "source-backed-stage-interval";
                /** @constant */
                training_cutoff: "known-at-origin";
            };
            overall_results: components["schemas"]["HistoricalAnalysisMetric"][];
            provenance: {
                historical_dataset_fingerprint: string;
                historical_dataset_version: string;
                report_code_fingerprint: string;
                /** Format: date */
                source_as_of_date: string;
                /** Format: date-time */
                source_issued_at: string;
                walk_forward_evaluation_fingerprint: string;
                /** @constant */
                walk_forward_evaluation_version: "walk-forward-evaluation/v1";
            };
            report_fingerprint: string;
            /** @constant */
            report_version: "historical-analysis-report/v1";
            /** @constant */
            status: "available";
            uncertainty: {
                empirical_intervals_included: boolean;
                /** @constant */
                minimum_reportable_scores: 8;
                /** @constant */
                minimum_training_outcomes: 8;
            };
        };
        HistoricalAnalysisResponse: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["HistoricalAnalysisReport"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            links: {
                /** @description Public page that summarizes this report. */
                analytics: string;
                /** @description Canonical path for the OpenAPI document. */
                openapi: string;
                /** @description Canonical path for this report. */
                self: string;
            };
        };
        occurrences: {
            /** @description How the change occurred, such as introduced or removed. */
            action: string;
            /** @description Contexts in which the change applies. */
            applicability: string[];
            /** @description Build number associated with this record, if known. */
            build_number: string | null;
            /** @description Public identifier of the related change definition. */
            change_id: string;
            /** @description Title of the related change definition. */
            change_title: string;
            /** @description Documentation state for the change occurrence. */
            documented_status: string;
            /** @description Evidence state for the change occurrence. */
            evidence_state: string;
            /** @description Major release family identifier. */
            family: string;
            /** @description Stable public identifier for this record. */
            id: string;
            /** @description How the occurrence inherits release context. */
            inheritance: string;
            /** @description Platform identifier, such as ios or macos. */
            platform: string;
            /** @description Number of linked public source records. */
            source_count: number;
            /** @description Public identifier of the cited or changed target. */
            target_id: string;
            /** @description Type of record cited or changed. */
            target_kind: string;
            /**
             * Format: date-time
             * @description UTC time when this record was last updated.
             */
            updated_at: string | null;
            /** @description Software vendor that owns the release record. */
            vendor: string;
            /** @description Version number as recorded by the archive. */
            version: string;
        };
        occurrencesCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["occurrences"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        occurrencesDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["occurrences"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        Pagination: {
            /** @description Requested page size. */
            limit: number;
            /** @description Next page path. */
            next: string | null;
            /** @description Requested record offset. */
            offset: number;
            /** @description Previous page path. */
            previous: string | null;
            /** @description Records in data. */
            returned: number;
            /** @description All matching records. */
            total: number;
        };
        provenance: {
            /** @description Public IDs affected by this provenance record. */
            affected_target_ids: string[];
            /** @description Stable public identifier for this record. */
            id: string;
            /**
             * Format: date-time
             * @description UTC time the provenance record was published.
             */
            published_at: string | null;
            /** @description Reason category for a correction, if applicable. */
            reason_category: string | null;
            /** @description Type of provenance record, such as audit_batch. */
            record_type: string;
            /** @description Platforms or records covered by this provenance record. */
            scope: string[];
            /** @description Identity of the reviewed source snapshot. */
            snapshot_identity: string | null;
            /** @description Current release or publication status. */
            status: string;
            /** @description Human-readable title for the record. */
            title: string;
            /**
             * Format: date
             * @description Date an audit or correction was verified.
             */
            verification_date: string | null;
        };
        provenanceCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["provenance"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        provenanceDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["provenance"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        releases: {
            /** @description Major release family identifier. */
            family: string;
            /** @description Stable public identifier for this record. */
            id: string;
            /** @description Platform identifier, such as ios or macos. */
            platform: string;
            /** @description Evidence-review state for the record. */
            provenance_status: string;
            /**
             * Format: date
             * @description Date the public software release became available.
             */
            public_release_date: string | null;
            /**
             * Format: uri
             * @description First-party release notes URL when available.
             */
            release_notes_url: string | null;
            /** @description Current release or publication status. */
            status: string;
            /**
             * Format: date-time
             * @description UTC time when this record was last updated.
             */
            updated_at: string | null;
            /** @description Software vendor that owns the release record. */
            vendor: string;
            /** @description Version number as recorded by the archive. */
            version: string;
        };
        releasesCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["releases"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        releasesDetail: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["releases"];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
        };
        SearchCollection: {
            /**
             * @description Major API contract version.
             * @constant
             */
            api_version: "v1";
            data: components["schemas"]["SearchResult"][];
            /**
             * Format: date-time
             * @description UTC time when this response snapshot was created. It is not the last update time for every record.
             */
            generated_at: string;
            /** @description Relative canonical API paths related to this response. */
            links: {
                [key: string]: string;
            };
            pagination: components["schemas"]["Pagination"];
        };
        SearchRecord: {
            /** @description Canonical relative API path for the factual record. */
            api_path: string;
            /**
             * @description Collection that owns the matching record.
             * @enum {string}
             */
            dataset: "releases" | "events" | "builds" | "occurrences";
            /** @description Exact public record ID. */
            id: string;
        };
        SearchResult: {
            build_number: string | null;
            change_type: string | null;
            channel: string | null;
            /** Format: date */
            date: string | null;
            documented_status: string | null;
            evidence_state: string | null;
            family: string | null;
            /** @description Relative Version Record page path. */
            href: string;
            /** @enum {string} */
            kind: "release" | "event" | "build" | "change";
            platform: string | null;
            publishers: string[];
            record: components["schemas"]["SearchRecord"];
            /** @description Relative relevance score. */
            score: number;
            /** @description Stable search-index identifier. */
            search_id: string;
            status: string | null;
            /** @description Display title of the search match. */
            title: string;
            vendor: string;
            version: string | null;
        };
    };
    responses: {
        /** @description The request has an invalid parameter. */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description The requested record does not exist. */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description A configured API rate limit rejected the request. */
        RateLimited: {
            headers: {
                /** @description Seconds to wait before retrying, when supplied by the limiter. */
                "Retry-After"?: number;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description The API cannot answer this request now. */
        Unavailable: {
            headers: {
                /** @description Seconds to wait before retrying. */
                "Retry-After"?: number;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getApiInformation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description API information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listBuilds: {
        parameters: {
            query?: {
                /** @description Get one verified build number. */
                build_number?: string;
                /** @description Get records from one major release family. */
                family?: string;
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get records from one platform. */
                platform?: string;
                /** @description Get records with one evidence state. */
                provenance_status?: string;
                /** @description Get builds with one availability state. */
                status?: string;
                /** @description Get records changed at or after one UTC date or time. */
                updated_since?: string;
                /** @description Get records from one vendor. */
                vendor?: string;
                /** @description Get records from one version. */
                version?: string;
                /** @description Get builds for one release record ID. */
                version_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["buildsCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getBuildsRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["buildsDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listChanges: {
        parameters: {
            query?: {
                /** @description Get changes from one category. */
                category?: string;
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get records changed at or after one UTC date or time. */
                updated_since?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["changesCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getChangesRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["changesDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listCitations: {
        parameters: {
            query?: {
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get citations from one publisher. */
                publisher?: string;
                /** @description Get citations from one source class. */
                source_class?: string;
                /** @description Get citations for one source record ID. */
                source_id?: string;
                /** @description Get citations for one target record ID. */
                target_id?: string;
                /** @description Get citations for one target type. */
                target_kind?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["citationsCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getCitationsRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["citationsDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listEvents: {
        parameters: {
            query?: {
                /** @description Get events with one availability state. */
                availability_state?: string;
                /** @description Get events for one verified build ID. */
                build_id?: string;
                /** @description Get events for one verified build number. */
                build_number?: string;
                /** @description Get events from one release channel. */
                channel?: string;
                /** @description Get records from one major release family. */
                family?: string;
                /** @description Get revision events or initial events. */
                is_revision?: boolean;
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get records from one platform. */
                platform?: string;
                /** @description Get records changed at or after one UTC date or time. */
                updated_since?: string;
                /** @description Get records from one vendor. */
                vendor?: string;
                /** @description Get records from one version. */
                version?: string;
                /** @description Get events for one release record ID. */
                version_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["eventsCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getEventsRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["eventsDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getHistoricalAnalysis: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The validated historical-analysis report. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HistoricalAnalysisResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listOccurrences: {
        parameters: {
            query?: {
                /** @description Get occurrences with one change action. */
                action?: string;
                /** @description Get occurrences for one change record ID. */
                change_id?: string;
                /** @description Get occurrences with one document state. */
                documented_status?: string;
                /** @description Get occurrences with one evidence state. */
                evidence_state?: string;
                /** @description Get records from one major release family. */
                family?: string;
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get records from one platform. */
                platform?: string;
                /** @description Get occurrences for one target record ID. */
                target_id?: string;
                /** @description Get occurrences for one target type. */
                target_kind?: string;
                /** @description Get records changed at or after one UTC date or time. */
                updated_since?: string;
                /** @description Get records from one vendor. */
                vendor?: string;
                /** @description Get records from one version. */
                version?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["occurrencesCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getOccurrencesRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["occurrencesDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getOpenApiDocument: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The OpenAPI document. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listProvenance: {
        parameters: {
            query?: {
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get corrections with one reason type. */
                reason_category?: string;
                /** @description Get one provenance record type. */
                record_type?: string;
                /** @description Get records that apply to one platform. */
                scope?: string;
                /** @description Get records with one publication state. */
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["provenanceCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getProvenanceRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["provenanceDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    listReleases: {
        parameters: {
            query?: {
                /** @description Get records from one major release family. */
                family?: string;
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get records from one platform. */
                platform?: string;
                /** @description Get records with one evidence state. */
                provenance_status?: string;
                /** @description Get records with one release state. */
                status?: string;
                /** @description Get records changed at or after one UTC date or time. */
                updated_since?: string;
                /** @description Get records from one vendor. */
                vendor?: string;
                /** @description Get records from one version. */
                version?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["releasesCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    getReleasesRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The exact public record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["releasesDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
    searchReleaseRecords: {
        parameters: {
            query: {
                /** @description Get records with one change action. */
                change_type?: string;
                /** @description Get records from one release channel. */
                channel?: string;
                /** @description Get records with one document state. */
                documented_status?: string;
                /** @description Get records with one evidence state. */
                evidence_state?: string;
                /** @description Get records from one major release family. */
                family?: string;
                /** @description Get one record kind. */
                kind?: string;
                /** @description Set the page size. Use an integer from 1 through 100. */
                limit?: number;
                /** @description Set the zero-based record offset. Use 0 through 1000000. */
                offset?: number;
                /** @description Get records from one platform. */
                platform?: string;
                /** @description Get records that cite one publisher. */
                publisher?: string;
                /** @description Send one or more letters or numbers. All search terms must match. */
                q: string;
                /** @description Get records with one status value. */
                status?: string;
                /** @description Get records from one vendor. */
                vendor?: string;
                /** @description Get records from one version. */
                version?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The ranked result page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchCollection"];
                };
            };
            400: components["responses"]["BadRequest"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["Unavailable"];
        };
    };
}
