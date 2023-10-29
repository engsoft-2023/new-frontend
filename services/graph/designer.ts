import { GraphEdge, GraphNode } from "./types";

export class GraphDesigner {
  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  public drawService(node: GraphNode) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, 3 * 1.4, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = node.clicked
      ? "orange"
      : node.highlighted
      ? "#6b46c1"
      : "#CCC";
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.fillStyle = "black";
    this.ctx.font = `3px 'Montserrat'`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(node.label, node.x, node.y + 9);
  }

  public drawDatabase(node: GraphNode) {
    const img = new Image();
    img.src = "/assets/database.svg";
    const size = 8;
    this.ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
    this.ctx.fillStyle = "black";
    this.ctx.font = `3px 'Montserrat'`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(node.label, node.x, node.y + 10);
  }

  public drawOperation(node: GraphNode) {
    this.ctx.beginPath();
    const width = 5;
    const height = 5;
    this.ctx.moveTo(node.x, node.y);
    // top left edge
    this.ctx.lineTo(node.x - width / 2, node.y + height / 2);

    // bottom left edge
    this.ctx.lineTo(node.x, node.y + height);

    // bottom right edge
    this.ctx.lineTo(node.x + width / 2, node.y + height / 2);
    this.ctx.fillStyle = node.highlighted ? "#6b46c1" : "blue";
    this.ctx.fill();
    this.ctx.fillStyle = "black";
    this.ctx.font = `3px 'Montserrat'`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(node.label, node.x, node.y + 6);
  }

  public drawLinkLabelForDatabaseUsages(nodeRelSize: number, link: GraphEdge) {
    const MAX_FONT_SIZE = 4;
    const LABEL_NODE_MARGIN = nodeRelSize * 1.5;

    const start = link.source;
    const end = link.target;

    // ignore unbound links
    if (typeof start !== "object" || typeof end !== "object") return;

    // calculate label positioning
    const textPos = {
      x: start["x"] + (end["x"] - start["x"]) / 2,
      y: start["y"] + (end["y"] - start["y"]) / 2,
    };

    const relLink = { x: end.x - start.x, y: end.y - start.y };

    const maxTextLength =
      Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
      LABEL_NODE_MARGIN * 2;

    let textAngle = Math.atan2(relLink.y, relLink.x);
    // maintain label vertical orientation for legibility
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

    // estimate fontSize to fit in link length
    this.ctx.font = "1px Sans-Serif";
    const fontSize = Math.min(
      MAX_FONT_SIZE,
      maxTextLength / this.ctx.measureText(link.label).width
    );
    this.ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = this.ctx.measureText(link.label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

    // draw text link.label (with background rect)
    this.ctx.save();
    this.ctx.translate(textPos.x, textPos.y);
    this.ctx.rotate(textAngle);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.fillRect(
      -bckgDimensions[0] / 2,
      -bckgDimensions[1] / 2,
      bckgDimensions[0],
      bckgDimensions[1]
    );

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "darkgrey";
    this.ctx.fillText(link.label, 0, 0);
    this.ctx.restore();
  }
}
