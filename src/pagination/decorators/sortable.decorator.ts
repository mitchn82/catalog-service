import 'reflect-metadata';

const metadataKey = Symbol('Sortable');

export function Sortable(): (target: object, propertyKey: string) => void {
  return (target: object, propertyKey: string): void => {
    let properties: string[] = Reflect.getMetadata(metadataKey, target);

    if (properties) {
      properties.push(propertyKey);
    } else {
      properties = [propertyKey];
      Reflect.defineMetadata(metadataKey, properties, target);
    };
  }
}

export function getSortableProperties(origin: object): string[] {
  return Reflect.getMetadata(metadataKey, origin);
}