export class Player {
    constructor() {
        this.blockSet = [
            [
                [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:2,y:0}],
                [{x:0,y:-1},{x:0,y:0},{x:0,y:1},{x:0,y:2}],
                [{x:1,y:0},{x:0,y:0},{x:-1,y:0},{x:-2,y:0}],
                [{x:0,y:1},{x:0,y:0},{x:0,y:-1},{x:0,y:-2}]
            ], //작대기
            [],
            [],
            [],
            [],
            [],
            []
        ]
    }
    getNextBlockSet() {

    }
}