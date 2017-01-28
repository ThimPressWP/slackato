'use strict'

Promise.resolve()
    .then(
        function() {

            console.log( "Recursion - external function." );
            return( 3 );

        }
    )
    .then(
        function( n ) {

            // With the recursive function factored out into its own stand-alone
            // function, it's a lot easier to see that we are creating a totally
            // TANGENTIAL BRANCH of the Promise chain.
            // --
            // A
            // |
            // B --> B'3 --> B'2 --> B'1 --> B'0
            // |
            // C
            var tangentialPromiseBranch = recurseToZero( n );

            return( tangentialPromiseBranch );

        }
    )
    .then(
        function() {

            console.log('End');

        }
    )
;


// I am the recursive function, factored-out into its own function.
function recurseToZero( n ) {

    console.log( "Entering recursive function for [", n, "]." );

    // Once we hit zero, bail out of the recursion. The key to recursion is that
    // it stops at some point, and the callstack can be "rolled" back up.
    if ( n === 0 ) {

        return( 0 );

    }

    // Start a NEW PROMISE CHAIN that will become the continuation of the parent
    // promise chain. This new promise chain now becomes a completely tangential
    // branch to the parent promise chain.
    var tangentialPromiseBranch = Promise.resolve().then(
        function() {

            return( recurseToZero( n - 1 ) ); // RECURSE!

        }
    );

    return( tangentialPromiseBranch );

}