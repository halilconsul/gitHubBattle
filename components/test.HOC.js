import React from "react";

export default function withHover(Component) {
  return class WithHover extends React.Component {
    state = {
      isHovered: false
    };

    toggleHover = () => {
      this.setState({
        isHovered: !this.state.isHovered
      });
    };

    render() {
      return (
        <div>
          <Component
            isHovered={this.state.isHovered}
            toggleHover={this.toggleHover}
            {...props}
          />
        </div>
      );
    }
  };
}
