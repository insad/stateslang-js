import { lensPath, view } from 'ramda'

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/awl-ref-filters.html
 */
export default function applyOutputPath(
  result: mixed,
  path: string | undefined | null,
): mixed {
  let outputPath = path
  // If the path is null return the input
  if (path === null) return {}
  // If the path is undefined (i.e. omitted) default to $
  if (path === undefined) { outputPath = '$' }
  const wrappedInput = {
    $: result,
  }
  const lens = lensPath(outputPath!.split('.'))
  return view(lens, wrappedInput)
}
