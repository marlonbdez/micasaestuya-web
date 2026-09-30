const manifest = JSON.parse(process.env.MANIFEST || '[]')
const categories = [
  ['performance', 'Rendimiento'],
  ['accessibility', 'Accesibilidad'],
  ['best-practices', 'Buenas prácticas'],
  ['seo', 'SEO']
]

const badge = (score) => {
  const points = Math.round(score * 100)
  return `${score >= 0.9 ? '🟢' : score >= 0.5 ? '🟠' : '🔴'} ${points}`
}

const rows = manifest
  .filter((run) => run.isRepresentativeRun)
  .map((run) => {
    const { pathname } = new URL(run.url)
    const scores = categories.map(([key]) => badge(run.summary[key]))
    return `| \`${pathname}\` | ${scores.join(' | ')} |`
  })

console.log(`## Lighthouse

Móvil, mediana de 3 ejecuciones sobre el build de esta PR.

| Página | ${categories.map(([, label]) => label).join(' | ')} |
| --- | ${categories.map(() => '---:').join(' | ')} |
${rows.join('\n')}

🟢 90 o más · 🟠 50 a 89 · 🔴 menos de 50. El informe completo de cada ejecución está en los artefactos de la ejecución.`)
