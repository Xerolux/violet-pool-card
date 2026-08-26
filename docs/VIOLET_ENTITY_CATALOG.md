# Violet entity catalog

This repository keeps two complementary entity inventories:

- [`catalog/live-violet-entities.json`](../catalog/live-violet-entities.json) is a snapshot of the **266 entities returned by** `integration_entities('violet_pool_controller')` on the working Home Assistant installation on 2026-08-26.
- [`tests/fixtures/integration-entity-keys.json`](../tests/fixtures/integration-entity-keys.json) is the generated catalog of all **583 entity translation keys** supported by the Violet integration source.

The live snapshot intentionally stores only entity IDs and aggregate domain counts. It contains no states, attributes, device IDs, config-entry IDs, 1-Wire addresses, IP addresses, tokens, or other credentials. This makes it useful as a stable development reference without copying operational or secret data into Git.

## Refresh the live snapshot

In Home Assistant, open **Developer tools → Template** and render:

```jinja2
{{ integration_entities('violet_pool_controller') | sort | to_json }}
```

Copy the resulting entity ID array into `catalog/live-violet-entities.json`, update `captured_at`, `total`, and the domain counts, then run:

```bash
npm test -- tests/entity-catalog.test.ts
```

If the integration itself added or removed supported entities, refresh its source catalog separately:

```bash
npm run keys:update
```

The tests ensure both inventories remain internally consistent and prevent accidental expansion of the live snapshot into a state or registry dump.
