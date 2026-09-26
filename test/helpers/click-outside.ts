const nextTick = () => new Promise((resolve) => setTimeout(resolve))

// VueUse's onClickOutside ignores a second click within the same tick.
export const clickOutside = async () => {
  await nextTick()
  document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
  document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await nextTick()
}
