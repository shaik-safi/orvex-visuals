export function openPopupPlaceholder(label: string): Window | null {
  const popup = window.open("", "_blank")
  if (!popup) return null

  try {
    popup.document.open()
    popup.document.write("<!doctype html><html><head><meta charset=\"utf-8\"></head><body></body></html>")
    popup.document.close()
    popup.document.title = label

    if (popup.document.body) {
      popup.document.body.style.margin = "0"
      popup.document.body.style.minHeight = "100vh"
      popup.document.body.style.display = "grid"
      popup.document.body.style.placeItems = "center"
      popup.document.body.style.padding = "24px"
      popup.document.body.style.fontFamily = "system-ui, sans-serif"
      popup.document.body.style.background = "#020617"
      popup.document.body.style.color = "#e2e8f0"
      popup.document.body.style.textAlign = "center"
      popup.document.body.textContent = label
    }
  } catch {
    // Ignore placeholder rendering failures and still use the popup window.
  }

  try {
    popup.focus()
  } catch {
    // Ignore focus failures.
  }

  return popup
}

export function navigatePopupWindow(popup: Window | null, url: string): boolean {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

export function openPopupWindow(url: string): boolean {
  const popup = window.open(url, "_blank", "noopener,noreferrer")
  if (!popup) return false

  try {
    popup.focus()
  } catch {
    // Ignore focus failures.
  }

  return true
}

export function closePopupWindow(popup: Window | null) {
  if (!popup || popup.closed) return

  try {
    popup.close()
  } catch {
    // Ignore close failures.
  }
}