import React from 'react';
import styled from "styled-components";

interface StyledTitleProps {
    size: number,
}

const StyledTitle = styled.p<StyledTitleProps>`
  text-align: center;
  margin-top: 10px;
  color: orange;
  font-size: ${props => props.size + "px" ?? null};
`;

interface TitleProps {
    text: String,
    size: number,
}

const Title = ({text, size}: TitleProps) => {
    return (
        <>
            <StyledTitle size={size}>
                {text}
            </StyledTitle>
        </>
    )
}

export default Title;
