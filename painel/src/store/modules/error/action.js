export function requestFailed (dataRequest) {
  return {
    type: '@error/REQUEST_FAILED',
    dataRequest
  }
}
