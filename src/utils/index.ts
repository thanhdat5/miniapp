export const telegramInitDataRawToObject = (encodedString: string) => {
  // Decode the URL-encoded string
  const decodedString = decodeURIComponent(encodedString)
  // Split the string into key-value pairs
  const params = decodedString.split('&')
  // Create an object to hold the parsed values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {}
  params.forEach((param) => {
    // Split each key-value pair
    const [key, value] = param.split('=')
    // Parse JSON string if the key is 'user'
    if (key === 'user') {
      result[key] = JSON.parse(value)
    } else {
      result[key] = value
    }
  })
  return result
}
