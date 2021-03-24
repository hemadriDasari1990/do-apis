export declare function createOrUpdateReaction(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function findReactionsByNoteAndDelete(noteId: string): Promise<any>;
export declare function getReaction(query: {
    [Key: string]: any;
}): Promise<any>;
