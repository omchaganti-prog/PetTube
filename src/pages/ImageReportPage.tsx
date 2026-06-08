import React, { useMemo, useState } from 'react';
import { ANIMAL_REGISTRY } from '../data/animalRegistry';
import { CURATED_SHOTS } from '../data/curatedShots';
import { getPoolSize } from '../services/imagePool';
import { getAllImageRecords, clearImageHistory } from '../utils/imageHistory';
import { RARITY_COLORS, RARITY_ICONS } from '../constants';

const LOW_WARNING = 6;   // ⚠️ below this
const CRITICAL    = 3;   // 🔴 below this

export default function ImageReportPage() {
  const [cleared, setCleared] = useState(false);
  const records = useMemo(() => getAllImageRecords(), [cleared]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    return ANIMAL_REGISTRY.map(entry => {
      const shots    = CURATED_SHOTS[entry.id] ?? [];
      const poolSize = getPoolSize(entry.id as any);
      // Count images that have been shown from persistent history
      const shownUrls = Object.keys(records);
      const timesShownTotal = shownUrls
        .filter(url => {
          // Heuristic: URL associated with this species (LoremFlickr keyword match)
          const kw = entry.keyword.toLowerCase().replace(/[^a-z]/g, '');
          return url.includes(kw) || url.includes(entry.id.replace(/-/g, ''));
        })
        .reduce((sum, url) => sum + (records[url]?.timesShown ?? 0), 0);

      return {
        id:            entry.id,
        name:          entry.name,
        emoji:         entry.emoji,
        rarity:        entry.speciesRarity,
        curatedCount:  shots.length,
        poolSize,
        timesShownTotal,
      };
    }).sort((a, b) => a.curatedCount - b.curatedCount);
  }, [records]);

  const totalCurated  = rows.reduce((s, r) => s + r.curatedCount, 0);
  const criticalCount = rows.filter(r => r.curatedCount < CRITICAL).length;
  const lowCount      = rows.filter(r => r.curatedCount >= CRITICAL && r.curatedCount < LOW_WARNING).length;

  function handleClear() {
    clearImageHistory();
    setCleared(c => !c);
  }

  return (
    <div className="img-report-page">
      <div className="img-report-header">
        <h1>🖼️ Image Availability Report</h1>
        <p className="img-report-subtitle">
          {ANIMAL_REGISTRY.length} species · {totalCurated} curated article slots ·&nbsp;
          {criticalCount > 0 && <span className="img-report-crit">🔴 {criticalCount} critical</span>}
          {lowCount > 0 && <span className="img-report-warn"> ⚠️ {lowCount} low</span>}
        </p>
        <button className="img-report-clear-btn" onClick={handleClear}>
          🗑️ Clear Image History
        </button>
      </div>

      <div className="img-report-legend">
        <span><span className="img-badge ok" /> ≥{LOW_WARNING} images (good)</span>
        <span><span className="img-badge warn" /> {CRITICAL}–{LOW_WARNING - 1} images (low)</span>
        <span><span className="img-badge crit" /> &lt;{CRITICAL} images (needs work)</span>
      </div>

      <div className="img-report-table-wrap">
        <table className="img-report-table">
          <thead>
            <tr>
              <th>Species</th>
              <th>Rarity</th>
              <th>Curated Articles</th>
              <th>In Pool</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const status = row.curatedCount < CRITICAL ? 'crit'
                           : row.curatedCount < LOW_WARNING ? 'warn'
                           : 'ok';
              return (
                <tr key={row.id} className={`img-report-row ${status}`}>
                  <td className="img-report-name">
                    <span className="img-report-emoji">{row.emoji}</span>
                    <span>{row.name}</span>
                    <span className="img-report-id">/{row.id}</span>
                  </td>
                  <td>
                    <span
                      className="img-report-rarity"
                      style={{ color: RARITY_COLORS[row.rarity] }}
                    >
                      {RARITY_ICONS[row.rarity]}
                    </span>
                  </td>
                  <td className="img-report-count">
                    <span className={`img-count-badge ${status}`}>{row.curatedCount}</span>
                  </td>
                  <td className="img-report-pool">
                    {row.poolSize}
                  </td>
                  <td>
                    {status === 'crit' && <span className="img-status-badge crit">🔴 Critical</span>}
                    {status === 'warn' && <span className="img-status-badge warn">⚠️ Low</span>}
                    {status === 'ok'   && <span className="img-status-badge ok">✅ Good</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
