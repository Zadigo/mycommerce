import { collectionRestApiFixture } from '~~/layers/base/app/utils/__fixtures__'

export default defineCachedEventHandler(async (_event): Promise<typeof collectionRestApiFixture> => {
  try {
    return collectionRestApiFixture
  } catch (e) {
    console.error('Error fetching collections:', e)
    return { data: { allCollections: [] } }
  }
}, {
  base: 'redis',
  name: 'collections',
  maxAge: 0 // disable cache for now
})
