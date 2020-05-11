// graph setup
const dims = {
  height: 600,
  width: 1100
}
// graph margins
const margins = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}

// create SVG
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width)
  .attr('height', dims.height + 200)

// create graph group
const graph = svg.append('g')
  .attr('transform', `translate(${margins.top},${margins.left})`);

// data stratify
const stratify = d3.stratify()
  .id(d => d.name)
  .parentId(d => d.parent);

// tree data
const tree = d3.tree()
  .size([dims.width, dims.height]);

// color scale
const color = d3.scaleOrdinal(d3['schemeSet1'])

// update function
const update = function(data) {
  // set color domain
  color.domain(data.map(d => d.department));

  // remove current nodes
  graph.selectAll('.node').remove();
  graph.selectAll('.link').remove();
  // get updated root node data
  const rootNode = stratify(data);

  // pass in stratified data to tree generator
  // this gives us x & y positions for every node
  const treeData = tree(rootNode);

  // get link selection and join data
  const links = graph.selectAll('.link')
    .data(treeData.links())

  // enter new links
  links.enter()
    .append('path')
    .attr('class','link')
    .attr('fill', 'none')
    .attr('stroke','#aaa')
    .attr('stroke-width', 2)
    .attr('d', d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y)
      );

  // get nodes selection and join data in array format
  const nodes = graph.selectAll('.node')
    .data(treeData.descendants());

  // create enter node groups
  const enterNodes = nodes.enter()
    .append('g')
      .attr('class','node')
      // position each group
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

  // append rect to enter nodes
  enterNodes.append('rect')
    .attr('fill', d => color(d.data.department))
    .attr('stroke', '#555')
    .attr('stroke-width', 2)
    .attr('height', 50)
    .attr('width', d => d.data.name.length * 20)
    // adjust rectangles 
    .attr('transform', d => {
      let xAdj = d.data.name.length * 10
      return `translate( ${-xAdj}, -27.5)`
    });

  // append name text
  enterNodes.append('text')
  .attr('text-anchor', 'middle')
  .attr('fill', 'white')
  .text(d => d.data.name)

}

// realtime data setup
let data = [];
db.collection('employees').onSnapshot(res => {
  res.docChanges().forEach(change => {

    const doc = {
      ...change.doc.data(), 
      id: change.doc.id
    };
    //console.log( change, doc);

    // handle the change
    switch (change.type){
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => 
          item.id === doc.id);
        data[index] = doc ;
        break;
      case 'removed':
        data = data.filter(item => 
          item.id !== doc.id);
        break;
      default:
        break;
    }
  })
  update(data);
})
