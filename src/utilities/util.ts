export const deleteElementFromObject = (
  objects: Record<string, unknown>[],
  element: string
) => {
  objects.map((object) => {
    delete object[element];
  });
  console.log({ objects });
  return objects;
};
