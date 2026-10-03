# RHS PCA1 Plant Data Audit

## Source scope

- Official syllabus list: uploaded `L2 PCA1 Plant List v9 25.08.2026` PDF.
- Plant profile data source: RHS plant profiles on `rhs.org.uk`, stored per plant in the standalone `index.html` file as `sourceUrl`.
- Current focus group now contains exactly:
  - `Araucaria araucana`
  - `Buxus sempervirens`
  - `× Cuprocyparis leylandii`
  - `Daphne bholua`
  - `Ilex aquifolium`
  - `Monstera deliciosa`
  - `Salvia rosmarinus`
  - `Sarcococca confusa`
  - `Skimmia japonica`
  - `Taxus baccata`
  - `Viburnum davidii`

## Key problems found in the pasted iteration

1. **The database was incomplete.** The PDF contains 46 numbered PCA1 entries, but the pasted app only had a reduced subset.
2. **Several IDs were stale and pointed at wrong plants.** For example:
   - PDF #56 is `Ilex aquifolium`, not `Hedera helix`.
   - PDF #69 is `Monstera deliciosa`, not `Lavandula angustifolia`.
   - PDF #91 is `Salvia rosmarinus`, not `Rhododendron ponticum`.
   - PDF #95 is `Skimmia japonica`, not `Sarcococca confusa`.
   - PDF #107 is `Viburnum davidii`, not `Vinca major`.
3. **Accepted RHS names were replaced by older synonyms.** `Salvia rosmarinus` is the RHS accepted name for rosemary on the current plant profile; `Rosmarinus officinalis` is only a synonym and should not replace the exam-list name.
4. **Some RHS attributes were wrong or out of date.** Examples corrected in the focus group include:
   - `Araucaria araucana`: RHS hardiness `H7`, not `H6`.
   - `Buxus sempervirens`: RHS maximum height and spread bands are `4–8 metres`.
   - `Daphne bholua`: RHS pH is acid/alkaline/neutral, displayed as `pH: Any`.
5. **Presentation wording made "Any" harder to scan.** The app now labels each value as `Light Exposure: ...`, `Aspect: ...`, `pH: ...`, and `Soil Type: ...`, so "Any" follows the field it describes.

## Implementation safeguards

- The distributable app is now a single standalone `index.html` file; no companion `.js` or `.json` file is required to open it in a browser.
- Every plant record includes an RHS source URL.
- `npm test` validates:
  - 46 PCA1 plant records are present.
  - Focus group names match the requested 11.
  - `Salvia rosmarinus` has not been replaced by `Rosmarinus officinalis`.
  - All hardiness values exist in the local RHS hardiness dictionary.
  - No plant data field contains old phrases such as `Any Light Exposure`.
