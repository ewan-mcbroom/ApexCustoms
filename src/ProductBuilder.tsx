import { useEffect, useMemo, useState } from 'react'
import './ProductBuilder.css'

type ProductGroup = 'wheels' | 'extras'

type Product = {
  id: string
  group: ProductGroup
  title: string
  detail: string
  price: number
  image: string
  sourceUrl: string
  sourceName: string
  partNumber?: string
  condition?: string
  fitment?: string
}

const targaFitment = 'Seller fitment: Porsche 911 992 II GTS / 4 GTS, Cabriolet & Targa (2024–present).'
const wheelSource = 'https://www.or24.de/en/porsche/model-911/generation-992-ii/911-992-ii-gts-4-targa/'

const products: Product[] = [
  {
    id: 'oem-gloss-black',
    group: 'wheels',
    title: 'OEM 5-double-spoke wheel set',
    detail: '20 × 8.5 in front · 21 × 11 in rear · gloss black',
    price: 3997,
    image: 'https://www.or24.de/cdn-cgi/image/width=700,height=520,quality=82,format=auto,fit=contain,onerror=redirect/media/62/e0/b5/1783429247/43918-5-doppelspeichen-original-porsche-992-ii-felgen-20-21-zoll-carrera-c2-c4-gts-992601025et-992601025gg-schwarz-glanz-neu.JPG?ts=1783429247',
    sourceUrl: 'https://www.or24.de/en/porsche/oem-porsche-992-ii-rims-2021-inches-carrera-c2-c4-gts-992601025et-992601025gg-gloss-black-new/a-43918/',
    sourceName: 'Original Räder 24',
    partNumber: '992601025ET / 992601025GG',
    condition: 'New · set of four rims · center caps not included',
    fitment: targaFitment,
  },
  {
    id: 'oem-neodyme',
    group: 'wheels',
    title: 'OEM Carrera S Design wheel set',
    detail: '20 × 8.5 in front · 21 × 11.5 in rear · Neodyme',
    price: 4797,
    image: 'https://www.or24.de/cdn-cgi/image/width=700,height=520,quality=82,format=auto,fit=contain,onerror=redirect/media/2e/5e/08/1782689374/41413-carrera-s-design-original-porsche-911-felgen-20-21-zoll-992-ii-facelift-carrera-gts-c4-c2-992601025bj-992601025bk-neodyme98f278.jpg?ts=1782689374',
    sourceUrl: 'https://www.or24.de/en/porsche/oem-porsche-911-rims-20-21-inch-992-ii-facelift-carrera-gts-c4-c2-992601025bj-992601025bk-neodyme/a-41413/',
    sourceName: 'Original Räder 24',
    partNumber: '992601025BJ / 992601025BK',
    condition: 'Like new · set of four rims · center caps not included',
    fitment: targaFitment,
  },
  {
    id: 'center-caps',
    group: 'extras',
    title: 'Porsche wheel center caps',
    detail: 'Set of four · seller-recommended with OEM wheel sets',
    price: 167,
    image: 'https://www.or24.de/media/cf/73/b2/1784689585/40274-originale-porsche-felgendeckel---4-stueck_16f27c5.png?ts=1784689585',
    sourceUrl: wheelSource,
    sourceName: 'Original Räder 24',
    condition: 'Four caps · not included with the wheel sets above',
  },
  {
    id: 'tpms-kit',
    group: 'extras',
    title: 'TPMS sensors with installation',
    detail: 'Set of four · suggested by seller for a wheel change',
    price: 297,
    image: 'https://www.or24.de/media/37/fa/f0/1784651484/31684-rdk-sensoren---4-stuecka5893f.png?ts=1784651484',
    sourceUrl: wheelSource,
    sourceName: 'Original Räder 24',
    condition: 'Confirm sensor generation with the seller before ordering',
  },
  {
    id: 'locking-bolts',
    group: 'extras',
    title: 'Locking wheel bolts',
    detail: '20-piece anti-theft set · listed as a matching item',
    price: 197,
    image: 'https://www.or24.de/media/9d/d5/9e/1784690455/40457-radschrauben-inkl--diebstahlschutz---20-stueck_147da97.png?ts=1784690455',
    sourceUrl: wheelSource,
    sourceName: 'Original Räder 24',
    condition: 'Confirm bolt length and seat type for the selected set',
  },
]

const carImage = 'https://images.unsplash.com/photo-1711591748639-a746d84af895?auto=format&fit=crop&w=1600&q=88'
const carImageSource = 'https://unsplash.com/photos/a-black-sports-car-parked-in-a-parking-lot-NBXgpL5_cLI'
const euro = new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})

function readSavedBuild() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem('apex-product-build') ?? '[]')
    return Array.isArray(saved)
      ? saved.filter((id): id is string => typeof id === 'string' && products.some((product) => product.id === id))
      : []
  } catch {
    return []
  }
}

function ProductBuilder() {
  const [selectedIds, setSelectedIds] = useState<string[]>(readSavedBuild)
  const [activeGroup, setActiveGroup] = useState<ProductGroup>('wheels')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    localStorage.setItem('apex-product-build', JSON.stringify(selectedIds))
  }, [selectedIds])

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [selectedIds],
  )
  const visibleProducts = products.filter((product) => product.group === activeGroup)
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0)
  const wheelSelected = selectedProducts.some((product) => product.group === 'wheels')

  function toggleProduct(product: Product) {
    setSelectedIds((current) => {
      if (current.includes(product.id)) return current.filter((id) => id !== product.id)
      if (product.group === 'wheels') {
        return [...current.filter((id) => !products.some((item) => item.id === id && item.group === 'wheels')), product.id]
      }
      return [...current, product.id]
    })
  }

  async function copyBuild() {
    const lines = selectedProducts.map((product) => `${product.title}: ${euro.format(product.price)}`)
    const text = [
      '2025 Porsche 911 Targa 4 GTS — parts spec',
      ...lines,
      `Parts subtotal: ${euro.format(total)}`,
      'Car price, tax, shipping, and installation are not included.',
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setNotice('Parts spec copied')
    } catch {
      setNotice(text)
    }
    window.setTimeout(() => setNotice(''), 3000)
  }

  return (
    <div className="catalog-shell">
      <header className="catalog-header">
        <a className="catalog-brand" href="#top" aria-label="Apex Customs home">
          <span className="catalog-emblem">A</span>
          <span>APEX <i>CUSTOMS</i></span>
        </a>
        <div className="catalog-status"><span /> LIVE PART SOURCES</div>
        <button className="catalog-share" type="button" onClick={copyBuild}>Copy spec <span aria-hidden="true">↗</span></button>
      </header>

      <main className="catalog-main" id="top">
        <section className="catalog-intro">
          <div>
            <p className="catalog-kicker"><span>APEX / PARTS BUILDER</span> &nbsp; 01—02</p>
            <h1>Make it<br /><em>your 911.</em></h1>
          </div>
          <p>Start with the car.<br />Choose real parts from the catalog.</p>
        </section>

        <section className="vehicle-feature" aria-labelledby="vehicle-title">
          <div className="vehicle-photo-wrap">
            <img src={carImage} alt="Porsche 911 Targa 4S, reference photograph" />
            <span className="photo-source">REFERENCE PHOTO · 911 TARGA 4S <a href={carImageSource} target="_blank" rel="noreferrer">UNSPLASH ↗</a></span>
          </div>
          <div className="vehicle-summary">
            <p className="catalog-kicker">SUPPORTED MODEL / 01</p>
            <h2 id="vehicle-title">2025 Porsche<br /><em>911 Targa 4 GTS</em></h2>
            <p className="vehicle-generation">992 II · T-Hybrid · All-wheel drive</p>
            <div className="fitment-check">
              <span className="fitment-checkmark" aria-hidden="true">✓</span>
              <div><strong>Parts fitment checked</strong><span>Wheel listings include 992 II 4 GTS / Targa.</span></div>
            </div>
            <p className="vehicle-caveat">The available photo shows a real 911 Targa 4S, not the exact 2025 GTS trim. Parts below are separate catalog photos, not composited onto the car.</p>
            <a className="vehicle-source" href="https://www.porsche.com/uk/models/911/targa-models/911-targa-4-gts/" target="_blank" rel="noreferrer">View official 911 Targa 4 GTS ↗</a>
          </div>
        </section>

        <section className="parts-workspace" aria-label="Select real Porsche parts">
          <div className="parts-catalog">
            <div className="parts-heading">
              <div><p className="catalog-kicker">01 / PICK YOUR PARTS</p><h2>Genuine wheels &amp; accessories</h2></div>
              <span className="source-count">{visibleProducts.length} SOURCE LISTINGS</span>
            </div>
            <div className="product-tabs" role="tablist" aria-label="Part type">
              <button type="button" role="tab" aria-selected={activeGroup === 'wheels'} className={activeGroup === 'wheels' ? 'product-tab active' : 'product-tab'} onClick={() => setActiveGroup('wheels')}>Wheel sets <span>02</span></button>
              <button type="button" role="tab" aria-selected={activeGroup === 'extras'} className={activeGroup === 'extras' ? 'product-tab active' : 'product-tab'} onClick={() => setActiveGroup('extras')}>Wheel add-ons <span>03</span></button>
            </div>
            {activeGroup === 'extras' && !wheelSelected && (
              <p className="add-on-hint">Choose a wheel set first. These are listed by the seller as matching items.</p>
            )}
            <div className={`product-grid${activeGroup === 'extras' ? ' accessory-grid' : ''}`}>
              {visibleProducts.map((product) => {
                const selected = selectedIds.includes(product.id)
                const disabled = product.group === 'extras' && !wheelSelected
                return (
                  <article className={`product-card${selected ? ' selected' : ''}`} key={product.id}>
                    <div className={`product-image${product.group === 'extras' ? ' accessory-image' : ''}`}>
                      <img src={product.image} alt={`${product.title} product photograph`} loading="eager" />
                      <span>{product.group === 'wheels' ? 'GENUINE PORSCHE' : 'WHEEL ADD-ON'}</span>
                    </div>
                    <div className="product-content">
                      <div className="product-title-row">
                        <div><p className="product-maker">{product.sourceName}</p><h3>{product.title}</h3></div>
                        <strong className="product-price">{euro.format(product.price)}</strong>
                      </div>
                      <p className="product-detail">{product.detail}</p>
                      {product.partNumber && <p className="product-number">PART NO. {product.partNumber}</p>}
                      <p className="product-condition">{product.condition}</p>
                      {product.fitment && <p className="product-fitment">FITMENT VERIFIED · 992 II 4 GTS / TARGA</p>}
                      <div className="product-actions">
                        <a href={product.sourceUrl} target="_blank" rel="noreferrer">View source listing <span aria-hidden="true">↗</span></a>
                        <button type="button" disabled={disabled} aria-pressed={selected} onClick={() => toggleProduct(product)}>
                          {selected ? 'Added' : product.group === 'wheels' ? 'Choose set' : 'Add'}
                          <span aria-hidden="true">{selected ? '✓' : '+'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <p className="catalog-disclaimer">Prices shown in EUR as listed by Original Räder 24; verify current stock, tax, shipping, exact fitment and part suitability with the seller before purchase.</p>
          </div>

          <aside className="build-summary" aria-label="Your selected parts">
            <div className="summary-header"><div><p className="catalog-kicker">02 / YOUR SPEC</p><h2>Build sheet</h2></div><span>{String(selectedProducts.length).padStart(2, '0')}</span></div>
            <div className="summary-car"><span>BASE VEHICLE</span><strong>2025 Porsche 911 Targa 4 GTS</strong><small>Vehicle price not included</small></div>
            {selectedProducts.length ? (
              <div className="summary-items">
                {selectedProducts.map((product) => (
                  <div className="summary-item" key={product.id}>
                    <img src={product.image} alt="" />
                    <div><strong>{product.title}</strong><button type="button" onClick={() => toggleProduct(product)}>Remove</button></div>
                    <span>{euro.format(product.price)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="summary-empty"><span>+</span><p>Your parts list is empty.<br />Choose a wheel set to begin.</p></div>
            )}
            <div className="summary-total"><span>PARTS SUBTOTAL</span><strong>{euro.format(total)}</strong></div>
            <p className="summary-note">Vehicle price, taxes, shipping and installation are not included.</p>
            <button className="summary-copy" type="button" onClick={copyBuild} disabled={selectedProducts.length === 0}>Copy parts spec <span aria-hidden="true">↗</span></button>
            <button className="summary-reset" type="button" onClick={() => setSelectedIds([])} disabled={selectedProducts.length === 0}>Clear selected parts</button>
            <div className="summary-foot"><span>CHECK FITMENT WITH THE SELLER</span><span>APEX / 01</span></div>
          </aside>
        </section>
      </main>

      <footer className="catalog-footer"><span>APEX CUSTOMS</span><span>PARTS CATALOG PROTOTYPE</span><span>NO CHECKOUT · SOURCE LISTINGS OPEN DIRECTLY</span></footer>
      <div className={`catalog-notice${notice ? ' visible' : ''}`} role="status">{notice}</div>
    </div>
  )
}

export default ProductBuilder