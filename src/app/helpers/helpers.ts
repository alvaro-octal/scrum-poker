export class Helpers {
    static DestructureDocumentPath(reference: string): {
        collection: string;
        key: string;
    } {
        const split: string[] = reference.split('/');
        return { collection: split[0], key: split[1] };
    }
}
