# Seed Data

SQL scripts to seed local D1 database with realistic data.

## Usage

```bash
# Run all seed scripts in order
for f in src/db/seeds/*.sql; do
  npx wrangler d1 execute timorlist-db --local --file="$f"
done

# Or run individually
npx wrangler d1 execute timorlist-db --local --file=src/db/seeds/01_update_businesses.sql
npx wrangler d1 execute timorlist-db --local --file=src/db/seeds/02_update_products.sql
npx wrangler d1 execute timorlist-db --local --file=src/db/seeds/03_update_listings.sql
npx wrangler d1 execute timorlist-db --local --file=src/db/seeds/04_update_nonprofits.sql
npx wrangler d1 execute timorlist-db --local --file=src/db/seeds/05_update_public_sectors.sql
```

## Scripts

| Script | Purpose |
|--------|---------|
| `01_update_businesses.sql` | Update businesses with industry, contact, location, tags |
| `02_update_products.sql` | Add products with price_fields, price_unit, featured |
| `03_update_listings.sql` | Seed listings with description, condition, location |
| `04_update_nonprofits.sql` | Update NGOs with about_us, contact, tags |
| `05_update_public_sectors.sql` | Update government with opening_hours, tags |

## Data Counts

| Entity | Count |
|--------|-------|
| businesses | 30 |
| products | 30 |
| listings | 10 |
| non_profits | 13 |
| public_sectors | 5 |