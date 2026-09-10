<script setup lang="ts">
const properties = [
  {
    location: 'La Habana Vieja · Cuba',
    name: 'Casa colonial con terraza y vista al Malecón',
    badge: 'Casa Particular',
    beds: 3,
    baths: 2,
    guests: 6,
    price: 75,
    rating: 4.97,
    reviews: 84
  },
  {
    location: 'Las Terrenas · R. Dominicana',
    name: 'Villa con piscina privada a 200m de la playa',
    badge: 'Villa',
    beds: 4,
    baths: 3,
    guests: 8,
    price: 140,
    rating: 4.92,
    reviews: 56
  },
  {
    location: 'Ciudad Amurallada · Cartagena',
    name: 'Penthouse con rooftop en el centro histórico',
    badge: 'Apartamento',
    beds: 2,
    baths: 2,
    guests: 4,
    price: 95,
    rating: 4.89,
    reviews: 112
  },
  {
    location: 'Trinidad · Cuba',
    name: 'Casona del siglo XVIII con patio interior',
    badge: 'Casa Particular',
    beds: 2,
    baths: 1,
    guests: 4,
    price: 45,
    rating: 5.0,
    reviews: 31
  }
]
</script>

<template>
  <div class="section">
    <div class="section-header">
      <div>
        <div class="section-label">
          {{ $t('home.featured_properties.label') }}
        </div>
        <h2 class="section-title">
          {{ $t('home.featured_properties.title') }}
        </h2>
      </div>
      <a href="#" class="link-more">Ver todas →</a>
    </div>
    <div class="cards-grid">
      <div v-for="(prop, idx) in properties" :key="idx" class="prop-card">
        <div class="prop-img">
          <div class="prop-img-shimmer"></div>
          <div class="prop-badge">{{ prop.badge }}</div>
          <button
            type="button"
            class="prop-fav"
            aria-label="Agregar a favoritos"
          >
            ♡
          </button>
        </div>
        <div class="prop-body">
          <div class="prop-location">{{ prop.location }}</div>
          <div class="prop-name">{{ prop.name }}</div>
          <div class="prop-amenities">
            <div class="prop-amenity">🛏️ {{ prop.beds }} dorms</div>
            <div class="prop-amenity">🚿 {{ prop.baths }} baños</div>
            <div class="prop-amenity">👥 {{ prop.guests }} huéspedes</div>
          </div>
          <div class="prop-footer">
            <div>
              <div class="prop-price">
                ${{ prop.price }}<small>/noche</small>
              </div>
            </div>
            <div class="prop-rating">
              <span class="star">★</span>
              {{ prop.rating }} ({{ prop.reviews }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  padding: $section-padding-y $section-padding-x;
  max-width: $max-width-content;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: $gap-large;
  gap: $gap-medium;
  flex-wrap: wrap;
}

.section-label {
  font-size: $font-size-2xs;
  font-weight: 600;
  letter-spacing: 0.094rem;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: $gap-small;
}

.section-title {
  font-size: clamp(1.625rem, 3vw, 2.375rem);
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.05rem;
  line-height: 1.15;
  margin: 0;
}

.link-more {
  font-size: $font-size-sm;
  font-weight: 500;
  color: var(--text-3);
  text-decoration: none;
  transition: color 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover {
    color: var(--text);
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: $gap-extra-medium;
}

.prop-card {
  background: var(--bg);
  border-radius: $corner-radius-large;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  :root.dark-mode & {
    background: var(--zinc-900);
    border-color: var(--zinc-700);
  }

  &:hover {
    transform: translateY(-0.1875rem);
    box-shadow: var(--card-shadow-hover);
    border-color: transparent;
  }
}

.prop-img {
  position: relative;
  height: 12.5rem;
  background: var(--zinc-200);
  overflow: hidden;

  :root.dark-mode & {
    background: var(--zinc-800);
  }
}

.prop-img-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--zinc-200) 25%,
    var(--zinc-100) 50%,
    var(--zinc-200) 75%
  );
  background-size: 200% 200%;
  animation: shimmer 2s ease infinite;

  :root.dark-mode & {
    background: linear-gradient(
      135deg,
      var(--zinc-800) 25%,
      var(--zinc-700) 50%,
      var(--zinc-800) 75%
    );
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.prop-badge {
  position: absolute;
  top: $gap-extra-small;
  left: $gap-extra-small;
  background: var(--bg);
  color: var(--text);
  font-size: $font-size-2xs;
  font-weight: 600;
  padding: $gap-extra-tiny 0.625rem;
  border-radius: $corner-radius-pill;

  :root.dark-mode & {
    background: var(--zinc-900);
  }
}

.prop-fav {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  width: 2rem;
  height: 2rem;
  background: var(--bg);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-3);
  font-weight: 400;

  :root.dark-mode & {
    background: var(--zinc-900);
  }

  &:hover {
    transform: scale(1.15);
  }
}

.prop-body {
  padding: $gap-medium 1.125rem 1.125rem;
}

.prop-location {
  font-size: $font-size-2xs;
  font-weight: 600;
  letter-spacing: 0.031rem;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 0.3125rem;
}

.prop-name {
  font-size: $font-size-base;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.625rem;
  line-height: 1.3;
}

.prop-amenities {
  display: flex;
  gap: $gap-extra-small;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
}

.prop-amenity {
  font-size: $font-size-xs;
  color: var(--text-3);
}

.prop-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: $gap-extra-small;
  border-top: 1px solid var(--border);
}

.prop-price {
  font-size: $font-size-lg;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.019rem;

  small {
    font-size: $font-size-xs;
    font-weight: 400;
    color: var(--text-3);
  }
}

.prop-rating {
  display: flex;
  align-items: center;
  gap: $gap-extra-tiny;
  font-size: $font-size-sm;
  font-weight: 500;
  color: var(--text);
}

.star {
  color: var(--accent);
  font-size: $font-size-xs;
}

@include media-breakpoint-down(md) {
  .section {
    padding: $section-padding-y-sm $section-padding-x-sm;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: $gap-medium;
  }
}

@include media-breakpoint-down(sm) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
