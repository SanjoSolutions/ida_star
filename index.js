export function search(root, estimateTravelDistance, isSolution, requestChildren, requestParent) {
  let solution
  let maximumTravelDistance = estimateTravelDistance(root)
  do {
    const result = iteration(
      root,
      estimateTravelDistance,
      isSolution,
      requestChildren,
      requestParent,
      maximumTravelDistance
    )
    solution = result.solution
    if (maximumTravelDistance === result.nextMaximumTravelDistance) {
      return null
    } else {
      maximumTravelDistance = result.nextMaximumTravelDistance
    }
  } while (!solution)

  return solution
}

function iteration(root, estimateTravelDistance, isSolution, requestChildren, requestParent, maximumTravelDistance) {
  let node = root
  let nextMaximumTravelDistance = Infinity
  while (true) {
    if (isSolution(node)) {
      return {
        solution: node,
        nextMaximumTravelDistance: null,
      }
    } else {
      const estimatedTotalTravelDistance = estimateTravelDistance(node)
      if (estimatedTotalTravelDistance > maximumTravelDistance) {
        nextMaximumTravelDistance = Math.min(nextMaximumTravelDistance, estimatedTotalTravelDistance)
      }
      if (estimatedTotalTravelDistance <= maximumTravelDistance && requestChildren(node).length >= 1) {
        node = requestChildren(node)[0]
      } else {
        let parent = requestParent(node)
        while (parent) {
          const parentChildren = requestChildren(parent)
          const childIndex = parentChildren.indexOf(node)
          if (childIndex === -1) {
            throw new Error(
              'Could not find child node in children. ' +
                'Please make sure that references to the same nodes stay the same ' +
                'between multiple requestChildren calls for the same node.'
            )
          }
          const maximumChildIndex = parentChildren.length - 1
          if (childIndex < maximumChildIndex) {
            const nextChildIndex = childIndex + 1
            const nextChild = parentChildren[nextChildIndex]
            node = nextChild
            break
          } else {
            node = parent
            node.children = []
            parent = requestParent(node)
          }
        }
        if (!parent) {
          return {
            solution: null,
            nextMaximumTravelDistance,
          }
        }
      }
    }
  }
}
