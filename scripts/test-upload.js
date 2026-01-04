(async () => {
  try {
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
    const productRes = await fetch('http://127.0.0.1:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TestImageDB',
        price: 2,
        category: 'plantes-interieur',
        stock: 5,
        description: 'Test image stored in DB',
        imageBase64: base64,
        imageName: 'test.png',
        imageContentType: 'image/png',
      }),
    })

    const product = await productRes.json()
    console.log('Created product:', product)

    const imageUrl = product.image
    const url = imageUrl.startsWith('http') ? imageUrl : `http://127.0.0.1:3000${imageUrl}`
    const imgRes = await fetch(url)
    console.log('Image GET status:', imgRes.status)
    console.log('Image content-type:', imgRes.headers.get('content-type'))
    const buffer = await imgRes.arrayBuffer()
    console.log('Image bytes length:', buffer.byteLength)
  } catch (err) {
    console.error('Error during test upload:', err)
  }
})()