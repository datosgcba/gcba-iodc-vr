/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */


AFRAME.registerComponent('show-matrix', {
  schema: {
    on: {type: 'string'},
    item: {type: 'string'},
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var animated = false;
    
    
      el.setAttribute('animation__fade_3', {
        property: 'position',
        startEvents: 'move-now',
        dir: 'alternate',
        dur: 600,
        from: '0 0 2',
        to: '0 0 3.5'
      });

      el.setAttribute('animation__leave_1', {
        property: 'position',
        startEvents: 'move-out',
        dir: 'alternate',
        dur: 300,
        from: '0 0 3.5',
        to: '0 0 1'
      });
     
    el.addEventListener(data.on, function () {
      // Create animation.

      if (!animated){
        d3.selectAll('a-entity.item.active').dispatch('move-out');

        d3.select(el).attr('class','item active');
        el.emit('move-now');
        animated =true;
        
        window.game.datasetRowDetail(data.item);
      }

    });
    el.addEventListener('move-out', function () {
      // Create animation.
      animated =false;
      d3.select('a-entity.item.active detail').html('');
      d3.selectAll('a-entity.item .detail').text('');
      d3.select(el).attr('class','item');

    });
  },

 
});
