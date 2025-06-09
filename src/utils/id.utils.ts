import { v4 } from 'uuid';

export class uuid {
    public generate = (): string => {
        return v4();
    };
}
