$(function () {

    // if ($('textarea#ta').length) {//for the editor
    //     CKEDITOR.replace('ta');
    // }

    $('a.confirmDeletion').on('click', function () {//for confirm deletion
        if (!confirm('Confirm deletion'))
            return false;
    });

});