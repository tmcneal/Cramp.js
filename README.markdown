Cramps (ie. cuts off) an HTML element's content by adding ellipsis to it if the 
content inside is too long.

Also supports cramping an element containing non-text elements (images, etc).

# Sample Usage

<pre>
//Single line
$cramp(myHeader, {cramp: 1});

//Multi-line
$cramp(myHeader, {cramp: 3});

//Auto-cramp based on available height
$cramp(myParagraph, {cramp: 'auto'});

//Auto-cramp based on a fixed element height
$cramp(myParagraph, {cramp: '35px'});
</pre>

The $cramp method is the primary way of interacting with Cramp.js, and it takes two
arguments. The first is the element which should be cramped, and the second is an
Object with options in JSON notation.


# Options

**cramp** _(Number | String | 'auto')_. This controls where and when to cramp the 
text of an element. Submitting a number controls the number of lines that should
be displayed. Second, you can submit a CSS value (in px or em) that controls the
height of the element as a String. Finally, you can submit the word 'auto' as a string.
Auto will try to fill up the available space with the content and then automatically
cramp once content no longer fits. This last option should only be set if a static 
height is being set on the element elsewhere (such as through CSS) otherwise no 
cramping will be done.

**truncationChar** _(String)_. The character to insert at the end of the HTML element
after truncation is performed. This defaults to an ellipsis (…).
